# Deploy na VPS com Kubernetes (Braza Burger)

Este diretório contém um baseline para subir:
- app_cliente (Flutter Web + Nginx)
- api_manager (Node/Express)
- evolution-api + Postgres + Redis

## Comandos rápidos (local e VPS)

Use o makefile da raiz do projeto:

Local:

```bash
make k8s-build-local-images
make k8s-deploy-local
make k8s-monitor-local
make k8s-status-local
```

VPS (com contexto kubeconfig):

```bash
make k8s-deploy-vps KUBE_CONTEXT=seu-contexto
make k8s-monitor-vps KUBE_CONTEXT=seu-contexto
make k8s-status-vps KUBE_CONTEXT=seu-contexto
```

## Deploy pela GitHub Action (recomendado para VPS)

Workflow criado em:
- `.github/workflows/deploy-vps.yml`

Esse workflow faz:
1. build e push das imagens `api-manager` e `app-cliente` para Docker Hub
2. conecta na VPS por SSH
3. atualiza o repositório na VPS
4. roda `make k8s-deploy-vps-full` no servidor

### Secrets obrigatórios no GitHub

No repositório do GitHub, configure em Settings > Secrets and variables > Actions:

- `DOCKERHUB_USERNAME`: seu usuário do Docker Hub
- `DOCKERHUB_TOKEN`: token do Docker Hub (não use senha)
- `DOCKERHUB_NAMESPACE`: namespace das imagens (normalmente igual ao username)
- `APP_API_URL`: URL pública da API usada no build do Flutter (ex: `https://api.seudominio.com`)
- `VPS_HOST`: IP ou domínio da VPS
- `VPS_USER`: usuário SSH da VPS (ex: `root`)
- `VPS_SSH_KEY`: chave privada SSH (conteúdo completo)

### Secrets opcionais

- `VPS_SSH_PORT`: porta SSH (default 22)
- `VPS_PROJECT_DIR`: pasta do projeto na VPS (default `~/braza_burger`)
- `GH_REPO_TOKEN`: necessário apenas se o repositório for privado e a VPS não tiver acesso por HTTPS sem token

### Como rodar

Opção 1: push na `main` dispara automaticamente.

Opção 2: manual em Actions > Deploy VPS Kubernetes > Run workflow:
- `ref`: branch/tag/sha
- `kube_context`: opcional (vazio usa `kubectl config current-context` na VPS)
- `deploy_monitoring`: `true` ou `false`

### Como saber seu usuário

- `VPS_USER`: é o mesmo usuário que você usa no SSH (`ssh root@...` => user é `root`)
- `DOCKERHUB_USERNAME`: é seu login no Docker Hub

VPS via SSH + rsync (estilo automatizado):

```bash
make k8s-deploy-ssh \
  SERVER=root@62.171.180.87 \
  VPS_API_IMAGE=docker.io/SEU_USUARIO/api-manager:latest \
  VPS_APP_IMAGE=docker.io/SEU_USUARIO/app-cliente:latest \
  VPS_EVOLUTION_IMAGE=evoapicloud/evolution-api:latest
```

Esse alvo:
- sincroniza o projeto para a VPS com rsync
- entra por ssh
- executa `make k8s-deploy-vps-full` no servidor remoto
- usa automaticamente o contexto atual do kubectl da VPS

Significado de "usuario" (tem 2 tipos):
- SSH user: usuario da sua VPS, ex: `root` em `root@62.171.180.87`.
- Registry user: usuario do Docker Hub/GHCR para puxar imagens, ex: `docker.io/SEU_USUARIO/api-manager:latest`.

Se nao for usar imagens publicas no registry:
- deixe as imagens privadas e configure `imagePullSecret` no cluster, ou
- publique as imagens como publicas para simplificar o primeiro deploy.

Se estiver no Windows sem rsync, use fallback via scp:

```bash
make k8s-deploy-ssh-scp \
  SERVER=root@62.171.180.87 \
  VPS_API_IMAGE=docker.io/SEU_USUARIO/api-manager:latest \
  VPS_APP_IMAGE=docker.io/SEU_USUARIO/app-cliente:latest \
  VPS_EVOLUTION_IMAGE=evoapicloud/evolution-api:latest
```

Se `ssh`/`scp` nao estiverem no PATH do Windows:

```bash
make k8s-deploy-ssh-scp \
  SERVER=root@62.171.180.87 \
  SSH='C:/WINDOWS/System32/OpenSSH/ssh.exe' \
  SCP='C:/WINDOWS/System32/OpenSSH/scp.exe' \
  VPS_API_IMAGE=docker.io/SEU_USUARIO/api-manager:latest \
  VPS_APP_IMAGE=docker.io/SEU_USUARIO/app-cliente:latest \
  VPS_EVOLUTION_IMAGE=evoapicloud/evolution-api:latest
```

Deploy completo (app + api + evolution + monitoramento):

```bash
make k8s-deploy-vps-full \
  KUBE_CONTEXT=seu-contexto \
  VPS_API_IMAGE=docker.io/SEU_USUARIO/api-manager:latest \
  VPS_APP_IMAGE=docker.io/SEU_USUARIO/app-cliente:latest \
  VPS_EVOLUTION_IMAGE=evoapicloud/evolution-api:latest
```

## 1) Pré-requisitos na VPS

- Kubernetes instalado (recomendado: k3s)
- kubectl configurado para o cluster
- Ingress NGINX instalado
- Um registry para imagens (Docker Hub, GHCR, etc.)

Instalação rápida de k3s na VPS:

```bash
curl -sfL https://get.k3s.io | sh -
sudo kubectl get nodes
```

## 2) Build e push das imagens

Troque `SEU_USUARIO` pelo seu usuário do registry.

### api_manager

```bash
cd api_manager
docker build -f Dockerfile.prod -t docker.io/SEU_USUARIO/api-manager:latest .
docker push docker.io/SEU_USUARIO/api-manager:latest
```

### app_cliente

Use a URL pública da API no build do Flutter:

```bash
cd app_cliente
docker build -f Dockerfile.prod \
  --build-arg API_URL=https://api.seudominio.com \
  -t docker.io/SEU_USUARIO/app-cliente:latest .
docker push docker.io/SEU_USUARIO/app-cliente:latest
```

## 3) Criar secrets no cluster

### Namespace

```bash
kubectl apply -f deploy/k8s/manifests/namespace.yaml
```

### Secret do api_manager

Use seu .env real:

```bash
kubectl -n braza-burger create secret generic api-manager-env \
  --from-env-file=api_manager/.env \
  --dry-run=client -o yaml | kubectl apply -f -
```

### Secret do Evolution (demais variáveis)

```bash
kubectl -n braza-burger create secret generic evolution-env \
  --from-env-file=evolution-api/.env \
  --dry-run=client -o yaml | kubectl apply -f -
```

Importante: ajuste no seu `evolution-api/.env` pelo menos:
- `SERVER_URL=https://evolution.seudominio.com`
- `DATABASE_PROVIDER=postgresql`
- `POSTGRES_PASSWORD`
- `DATABASE_CONNECTION_URI`
- `CORS_ORIGIN=https://app.seudominio.com,https://api.seudominio.com`

Fallback padrao de primeiro deploy (para nao quebrar se faltar chave no .env):
- usuario do Postgres: `evolution`
- senha do Postgres: `evolution123`
- URI padrao: `postgresql://evolution:evolution123@evolution-postgres:5432/evolution_db?schema=evolution_api`

Depois do primeiro teste funcionando, troque a senha e URI para valores reais.

## 4) Ajustar domínios do Ingress

Edite o arquivo:
- `deploy/k8s/manifests/ingress.yaml`

Substituições necessárias:
- `app.seudominio.com`, `api.seudominio.com`, `evolution.seudominio.com`, `grafana.seudominio.com`, `prometheus.seudominio.com` pelos domínios reais

As imagens de app/api/evolution no VPS são aplicadas via variáveis no comando `make k8s-deploy-vps-full`.

## 5) Aplicar tudo

```bash
kubectl apply -k deploy/k8s/manifests
```

## 6) Verificar rollout

```bash
kubectl -n braza-burger get pods
kubectl -n braza-burger get svc
kubectl -n braza-burger get ingress
kubectl -n braza-burger rollout status deploy/api-manager
kubectl -n braza-burger rollout status deploy/app-cliente
kubectl -n braza-burger rollout status deploy/evolution-api
kubectl -n braza-burger get hpa
```

## Rotas da API (importante)

O Service do Kubernetes NAO limita rotas.

Em `api-manager.yaml`, o Service expoe a porta `5000` do pod.
Qualquer rota implementada no Express continua funcionando normalmente, por exemplo:
- `/produtos/com-insumos`
- `/pedido`
- `/users`
- `/configuracoes`
- `/api-docs`

Ou seja, o balanceamento acontece por conexao/pacote entre pods, nao por rota.

## Load balancing e autoscaling

- `api-manager` foi configurado com `replicas: 2` (load balancing imediato).
- HPA foi adicionado em `api-manager-hpa.yaml` com `minReplicas: 2` e `maxReplicas: 10`.
- Escala por CPU e memoria (resource metrics).

Para o HPA funcionar, o cluster precisa do metrics-server:

```bash
kubectl get deployment metrics-server -n kube-system
kubectl top nodes
kubectl top pods -n braza-burger
```

Se `kubectl top` falhar, instale o metrics-server antes.

## 7) Debug rápido

```bash
kubectl -n braza-burger logs deploy/api-manager --tail=100
kubectl -n braza-burger logs deploy/evolution-api --tail=100
kubectl -n braza-burger describe pod -l app=api-manager
```

## Monitoracao completa (metrics-server + Prometheus + Grafana)

Arquivos criados:
- `deploy/k8s/monitoring/kube-prometheus-values.yaml`
- `deploy/k8s/scripts/install-monitoring.sh`
- `deploy/k8s/scripts/install-monitoring.ps1`

Executar no host que tem acesso ao cluster:

Linux:

```bash
chmod +x deploy/k8s/scripts/install-monitoring.sh
./deploy/k8s/scripts/install-monitoring.sh
```

Windows PowerShell:

```powershell
./deploy/k8s/scripts/install-monitoring.ps1
```

Se falhar, rode este bloco de diagnostico e compartilhe a saida:

```bash
kubectl config current-context
kubectl get nodes -o wide
kubectl -n kube-system get deploy metrics-server
kubectl -n kube-system logs deploy/metrics-server --tail=120
kubectl top nodes
helm list -n monitoring
kubectl -n monitoring get pods
kubectl -n monitoring describe pod -l app.kubernetes.io/name=prometheus
```

Erros comuns:
- `InvalidImageName`: imagens com placeholder invalido ou nome mal formatado.
- `ErrImagePull`: registry sem acesso, nome/tag incorreto, ou internet indisponivel no node.
- `helm nao encontrado`: rode o script atualizado (ele tenta instalar via winget no Windows).

Acesso local por port-forward:

```bash
kubectl -n monitoring port-forward svc/kube-prometheus-stack-grafana 3000:80
kubectl -n monitoring port-forward svc/kube-prometheus-stack-prometheus 9090:9090
```

Credencial padrao inicial do Grafana:
- user: `admin`
- password: `admin123`

Troque a senha apos o primeiro acesso.

## Ingress no mesmo dominio (app + api + evolution + observabilidade)

O Ingress principal (`deploy/k8s/manifests/ingress.yaml`) agora expõe:
- app: `app.seudominio.com`
- api: `api.seudominio.com`
- evolution: `evolution.seudominio.com`
- grafana: `grafana.seudominio.com`
- prometheus: `prometheus.seudominio.com`

Para Grafana/Prometheus, foram adicionados serviços bridge em `braza-burger` que apontam para os serviços no namespace `monitoring`.

## Notas importantes

- CORS do `api_manager` está controlado por `ALLOWED_DOMAIN` no `.env`.
  Exemplo:
  `ALLOWED_DOMAIN=https://app.seudominio.com`
- O `app_cliente` embute a URL da API no build (`--build-arg API_URL=...`).
- Para TLS (HTTPS), instale cert-manager e adicione `tls` no Ingress.

## Sobre KEDA / AI scaling

- Melhor baseline para sua VPS: HPA (mais simples e estavel).
- KEDA e excelente para escalonamento orientado a eventos (fila, kafka, rabbitmq, etc.).
- "Digital Twin" e LSTM para autoscaling preditivo exigem stack de observabilidade e modelo de previsao; nao e o caminho mais seguro para primeiro deploy produtivo.

Recomendacao pratica:
1. Entrar em producao com HPA.
2. Medir trafego e latencia por alguns dias.
3. Evoluir para KEDA se houver workloads orientados a eventos.
