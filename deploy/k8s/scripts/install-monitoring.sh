#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
VALUES_FILE="$REPO_ROOT/deploy/k8s/monitoring/kube-prometheus-values.yaml"

if [ ! -f "$VALUES_FILE" ]; then
  echo "ERRO: values file nao encontrado em $VALUES_FILE"
  exit 1
fi

echo "[1/7] Validando acesso ao cluster"
kubectl cluster-info >/dev/null
kubectl get nodes

echo "[2/7] Instalando metrics-server"
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# K3s e algumas VPS precisam deste ajuste para TLS do kubelet.
# Usa JSON patch para nao sobrescrever o spec do container.
if ! kubectl -n kube-system get deploy metrics-server -o jsonpath='{.spec.template.spec.containers[0].args}' | grep -q -- '--kubelet-insecure-tls'; then
  kubectl -n kube-system patch deployment metrics-server --type='json' -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]' || true
  kubectl -n kube-system rollout restart deploy/metrics-server || true
fi

echo "[3/7] Aguardando metrics-server"
kubectl -n kube-system rollout status deploy/metrics-server --timeout=300s

echo "[4/7] Validando top"
kubectl top nodes || true

if ! command -v helm >/dev/null 2>&1; then
  echo "ERRO: helm nao encontrado. Instale helm e rode novamente."
  exit 1
fi

echo "[5/7] Repositorio Helm"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts --force-update
helm repo update

echo "[6/7] Instalando kube-prometheus-stack"
kubectl get ns monitoring >/dev/null 2>&1 || kubectl create namespace monitoring
helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f "$VALUES_FILE" \
  --wait \
  --timeout 15m

echo "[7/7] Validando pods e servicos"
kubectl -n monitoring get pods
kubectl -n monitoring get svc
kubectl -n braza-burger get hpa

echo "Concluido."
echo "Grafana local: kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000:80"
echo "Prometheus local: kubectl -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090:9090"
