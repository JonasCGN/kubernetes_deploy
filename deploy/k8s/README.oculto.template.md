# README Oculto de Secrets e Deploy

Este arquivo e um template privado para preencher variaveis e secrets do deploy.
Nao coloque valores reais no README publico.

Passo 1: copie este arquivo para deploy/k8s/README.oculto.md
Passo 2: preencha os campos com os dados reais
Passo 3: use os valores para cadastrar em GitHub Secrets

Observacao:
- O arquivo deploy/k8s/README.oculto.md esta no .gitignore
- Nao compartilhe este arquivo por chat, print ou commit

## Infra e Build (GitHub Secrets)

APP_API_URL=https://
VPS_HOST=
VPS_USER=
VPS_SSH_KEY=
VPS_SSH_PORT=
VPS_PROJECT_DIR=
GH_REPO_TOKEN=

### O que colocar em cada um

GHCR (GitHub Container Registry):
- Nao precisa criar secret de usuario/token de registry para push.
- O workflow usa github.token automaticamente para publicar imagens em ghcr.io.
- Nome das imagens geradas:
   - ghcr.io/<repo_owner>/<repo_name>-api-manager:<tag>
   - ghcr.io/<repo_owner>/<repo_name>-app-cliente:<tag>

APP_API_URL:
- URL publica da API usada no build do app
- Exemplo: https://api.seu-dominio.com

VPS_HOST:
- IP publico ou dominio da VPS

VPS_USER:
- Usuario SSH usado para acessar a VPS
- Exemplo: root, ubuntu, deploy

VPS_SSH_KEY:
- Conteudo completo da chave privada SSH (formato PEM)
- Inclui as linhas BEGIN e END

VPS_SSH_PORT (opcional):
- Porta SSH da VPS (padrão: 22)

VPS_PROJECT_DIR (opcional):
- Pasta do projeto na VPS
- Exemplo: ~/kubernetes_deploy

GH_REPO_TOKEN (opcional):
- Necessario apenas se o repositorio for privado e a VPS nao puder clonar sem token

## Variaveis Privadas (multilinha)

K8S_API_MANAGER_ENV=<conteudo inteiro de api_manager/.env>
K8S_EVOLUTION_ENV=<conteudo inteiro de evolution-api/.env>

Formato esperado (multilinha):

CHAVE_1=valor_1
CHAVE_2=valor_2
CHAVE_3=valor_3

### Como montar K8S_API_MANAGER_ENV

- Abra api_manager/.env
- Copie todas as linhas CHAVE=valor
- Cole no GitHub Secret K8S_API_MANAGER_ENV mantendo as quebras de linha

### Como montar K8S_EVOLUTION_ENV

- Abra evolution-api/.env
- Copie todas as linhas CHAVE=valor
- Cole no GitHub Secret K8S_EVOLUTION_ENV mantendo as quebras de linha

## Dominios Reais (GitHub Secrets)

APP_DOMAIN=
API_DOMAIN=
EVOLUTION_DOMAIN=
GRAFANA_DOMAIN=
PROMETHEUS_DOMAIN=
CERT_MANAGER_CLUSTER_ISSUER=letsencrypt-prod

Exemplo com nip.io (generico):

APP_DOMAIN=<APP_NAME>.<PUBLIC_IP>.nip.io
API_DOMAIN=<API_NAME>.<PUBLIC_IP>.nip.io
EVOLUTION_DOMAIN=<EVOLUTION_NAME>.<PUBLIC_IP>.nip.io
GRAFANA_DOMAIN=<GRAFANA_NAME>.<PUBLIC_IP>.nip.io
PROMETHEUS_DOMAIN=<PROMETHEUS_NAME>.<PUBLIC_IP>.nip.io

Regras importantes:
- nao use underscore (_) em dominio; use hifen (-)
- confirme a escrita de prometheus (nao "promethues")
- para primeiro teste, prefira CERT_MANAGER_CLUSTER_ISSUER=letsencrypt-staging
- depois troque para letsencrypt-prod

### O que colocar

APP_DOMAIN:
- Dominio publico do frontend

API_DOMAIN:
- Dominio publico da API

EVOLUTION_DOMAIN:
- Dominio publico da Evolution API

GRAFANA_DOMAIN:
- Dominio publico do Grafana

PROMETHEUS_DOMAIN:
- Dominio publico do Prometheus

CERT_MANAGER_CLUSTER_ISSUER (opcional):
- Nome do ClusterIssuer no cluster Kubernetes
- Se vazio, usar letsencrypt-prod

## Onde cadastrar no GitHub

1. Abrir repositorio no GitHub
2. Entrar em Settings
3. Environments
4. Selecionar ambiente (exemplo: production)
5. Environment secrets
6. Add secret
7. Criar cada chave exatamente com o mesmo nome do workflow

Opcional:
- manter tambem repository secrets para cenarios sem environment

## Checklist de Integridade e Privacidade

- Usar token no lugar de senha (GitHub e demais provedores)
- Nunca commitar arquivos .env
- Nunca commitar README.oculto.md preenchido
- Rotacionar tokens/chaves periodicamente
- Limitar escopo de tokens ao minimo necessario
- Revisar secrets apos troca de dominio, VPS ou credenciais

## Teste rapido apos cadastrar secrets

1. Executar workflow manual Deploy VPS Kubernetes
2. Inputs recomendados:
   - ref: master
   - kube_context: (vazio, para usar current-context da VPS)
   - deploy_monitoring: false
3. Validar se os pods sobem e se o ingress recebe os hosts corretos
