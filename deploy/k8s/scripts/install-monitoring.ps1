$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..\..\..")
$ValuesFile = Join-Path $RepoRoot "deploy\k8s\monitoring\kube-prometheus-values.yaml"

if (-not (Test-Path $ValuesFile)) {
  throw "Arquivo de values nao encontrado: $ValuesFile"
}

function Get-HelmCommand {
  $cmd = Get-Command helm -ErrorAction SilentlyContinue
  if ($cmd) {
    return "helm"
  }

  $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
  $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
  $env:Path = "$machinePath;$userPath"

  $cmd = Get-Command helm -ErrorAction SilentlyContinue
  if ($cmd) {
    return "helm"
  }

  $fallbacks = @(
    "C:\Program Files\Helm\helm.exe",
    "$env:LOCALAPPDATA\Microsoft\WinGet\Links\helm.exe",
    "$env:USERPROFILE\AppData\Local\Microsoft\WinGet\Links\helm.exe"
  )

  foreach ($fallback in $fallbacks) {
    if (Test-Path $fallback) {
      return $fallback
    }
  }

  return $null
}

Write-Host "[1/7] Validando acesso ao cluster"
kubectl cluster-info | Out-Null
kubectl get nodes

Write-Host "[2/7] Instalando metrics-server"
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

Write-Host "[2.1/7] Ajustando args para K3s/VPS (idempotente)"
try {
  $currentArgs = kubectl -n kube-system get deploy metrics-server -o jsonpath="{.spec.template.spec.containers[0].args}"
  if ($currentArgs -notmatch "--kubelet-insecure-tls") {
    kubectl -n kube-system patch deployment metrics-server --type='json' -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]' | Out-Null
    kubectl -n kube-system rollout restart deploy/metrics-server | Out-Null
  }
} catch {
  Write-Warning "Nao foi possivel aplicar patch do metrics-server automaticamente: $($_.Exception.Message)"
}

Write-Host "[2.2/7] Args atuais do metrics-server"
kubectl -n kube-system get deploy metrics-server -o jsonpath="{.spec.template.spec.containers[0].args}"; Write-Host ""

Write-Host "[3/7] Aguardando metrics-server"
try {
  kubectl -n kube-system rollout status deploy/metrics-server --timeout=300s
} catch {
  Write-Warning "metrics-server nao ficou pronto no tempo esperado. Logs para diagnostico:"
  kubectl -n kube-system logs deploy/metrics-server --tail=120
}

Write-Host "[4/7] Validando top"
try {
  kubectl top nodes
  kubectl top pods -A | Out-Null
} catch {
  Write-Warning "metrics-server ainda nao respondeu. Continue e valide depois com: kubectl top nodes"
}

if (-not (Get-HelmCommand)) {
  Write-Warning "helm nao encontrado. Tentando instalar via winget..."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install -e --id Helm.Helm --accept-source-agreements --accept-package-agreements
  }
}

$helmCmd = Get-HelmCommand
if (-not $helmCmd) {
  throw "helm continua indisponivel. Instale manualmente e rode novamente."
}

Write-Host "[5/7] Repositorio Helm"
& $helmCmd repo add prometheus-community https://prometheus-community.github.io/helm-charts --force-update
& $helmCmd repo update

Write-Host "[6/7] Instalando kube-prometheus-stack"
$nsExists = kubectl get ns monitoring --ignore-not-found
if (-not $nsExists) {
  kubectl create namespace monitoring | Out-Null
}
& $helmCmd upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack `
  -n monitoring `
  -f $ValuesFile `
  --wait `
  --timeout 15m

Write-Host "[7/7] Validando pods e servicos"
kubectl -n monitoring get pods
kubectl -n monitoring get svc
kubectl -n braza-burger get hpa --ignore-not-found

Write-Host "Concluido"
Write-Host "Grafana local: kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000:80"
Write-Host "Prometheus local: kubectl -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090:9090"