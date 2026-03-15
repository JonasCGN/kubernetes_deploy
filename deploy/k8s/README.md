# Kubernetes Deploy Guide (Public Template)

This document is intentionally generic for team/public usage.
Do not place real credentials, real hosts, or personal infrastructure details here.

## Scope

Deploys the following services to Kubernetes:
- app-cliente
- api-manager
- evolution-api
- monitoring stack (optional)

Main workflow:
- [deploy-vps.yml](../../../.github/workflows/deploy-vps.yml)

## Required GitHub Secrets

Configure all values in GitHub: Settings -> Secrets and variables -> Actions.
Recommended: store deploy secrets in a GitHub Environment (example: production).

Private filling template:
- [README.oculto.template.md](README.oculto.template.md)

### Container registry (GHCR)

No Docker Hub secrets are required for image push.
The workflow publishes images to GHCR using the workflow token (`github.token`).

Generated image names:
- ghcr.io/<repo_owner>/<repo_name>-api-manager:<tag>
- ghcr.io/<repo_owner>/<repo_name>-app-cliente:<tag>

Important:
- The workflow needs `packages: write` permission (already configured).
- If the package is private, configure image pull auth in the cluster (`imagePullSecret`) or make package visibility public.

### Build/runtime endpoints

- APP_API_URL=https://<API_PUBLIC_DOMAIN>

### VPS connection

- VPS_HOST=<VPS_HOST_OR_IP>
- VPS_USER=<VPS_SSH_USER>
- VPS_SSH_KEY=<VPS_PRIVATE_KEY_PEM>

Optional:
- VPS_SSH_PORT=<VPS_SSH_PORT>
- VPS_PROJECT_DIR=<VPS_PROJECT_DIR>
- GH_REPO_TOKEN=<GITHUB_TOKEN_FOR_PRIVATE_REPO>

### Kubernetes environment secrets (multiline)

- K8S_API_MANAGER_ENV=<API_MANAGER_ENV_CONTENT>
- K8S_EVOLUTION_ENV=<EVOLUTION_ENV_CONTENT>

Expected format for both multiline secrets:

```env
KEY_1=value_1
KEY_2=value_2
KEY_3=value_3
```

### Domain and TLS variables

- APP_DOMAIN=<APP_PUBLIC_DOMAIN>
- API_DOMAIN=<API_PUBLIC_DOMAIN>
- EVOLUTION_DOMAIN=<EVOLUTION_PUBLIC_DOMAIN>

Only when monitoring is enabled (`deploy_monitoring=true`):
- GRAFANA_DOMAIN=<GRAFANA_PUBLIC_DOMAIN>
- PROMETHEUS_DOMAIN=<PROMETHEUS_PUBLIC_DOMAIN>
- HEADLAMP_DOMAIN=<HEADLAMP_PUBLIC_DOMAIN>

Optional:
- CERT_MANAGER_CLUSTER_ISSUER=<CLUSTER_ISSUER_NAME>

## Security and Privacy Rules

- Never commit .env files.
- Never hardcode hostnames, private keys, tokens, or passwords.
- Keep all sensitive values in GitHub Secrets.
- Rotate any secret immediately if exposed.
- Use short-lived tokens whenever possible.

## Fast Deploy Strategy

- Use workflow_dispatch with deploy_monitoring=false for daily deploys.
- Enable monitoring install/upgrade only when needed.
- Docker build cache is enabled in the workflow to speed up repeated deploys.

## Monitoring Heatmap

When `deploy_monitoring=true`, a Grafana dashboard named `Kubernetes Pod Consumption Heatmap`
is applied automatically. It shows CPU and memory consumption per pod over time.

## Headlamp (Kubernetes UI)

When `deploy_monitoring=true`, Headlamp is installed via Helm in namespace `monitoring`
and exposed by Traefik with TLS using `HEADLAMP_DOMAIN`.

## How the Workflow Deploys

1. Builds and pushes api-manager and app-cliente images.
2. Connects to VPS via SSH.
3. Pulls latest code from the selected ref.
4. Validates cert-manager and ClusterIssuer.
5. Renders ingress domains from GitHub Secrets.
6. Creates/updates Kubernetes secrets from GitHub Secrets.
7. Applies manifests and waits for rollout.

## Cluster Prerequisites

- Kubernetes cluster reachable from VPS context.
- kubectl and helm installed on VPS.
- Traefik ingress controller installed.
- cert-manager installed.
- ClusterIssuer created (example: letsencrypt-prod).
- Default StorageClass available for PVCs.

Notes:
- You must use one ingress controller consistently (NGINX or Traefik).
- Current manifests are configured with ingressClassName=traefik.
- Monitoring ingress is applied only when `deploy_monitoring=true`.
- For quick public tests, nip.io domains are supported (for example: app.<PUBLIC_IP>.nip.io).

## Run Deployment

Automatic:
- Push to master branch.

Manual:
- Open GitHub Actions.
- Run Deploy VPS Kubernetes workflow.
- Inputs:
  - environment_name=<GITHUB_ENVIRONMENT_NAME>
  - ref=<BRANCH_OR_TAG_OR_SHA>
  - kube_context=<OPTIONAL_KUBECTL_CONTEXT>
  - deploy_monitoring=<true_or_false>

Environment behavior:
- On workflow_dispatch, the selected environment is used.
- On push to master, the workflow uses the `KUBERNETES_DEPLOY` environment by default.

## Verification Commands

```bash
kubectl -n braza-burger get pods
kubectl -n braza-burger get svc
kubectl -n braza-burger get ingress
kubectl -n braza-burger get hpa
kubectl -n braza-burger rollout status deploy/api-manager
kubectl -n braza-burger rollout status deploy/app-cliente
kubectl -n braza-burger rollout status deploy/evolution-api
```

## Troubleshooting

```bash
kubectl config current-context
kubectl get nodes -o wide
kubectl -n braza-burger get events --sort-by=.metadata.creationTimestamp
kubectl -n braza-burger logs deploy/api-manager --tail=100
kubectl -n braza-burger logs deploy/evolution-api --tail=100
```

Common errors:
- InvalidImageName: image name/tag malformed.
- ErrImagePull/ImagePullBackOff: registry auth or image/tag not found.
- cert-manager checks failing: missing CRDs or missing ClusterIssuer.
- 403 when pushing to GHCR: check repository Actions permissions and package write permissions.

## Public Documentation Policy

This README should stay template-based.
Use only placeholders for all private values.
If project-specific values are needed, keep them in private runbooks outside the repository.
