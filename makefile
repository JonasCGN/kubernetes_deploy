.PHONY: help \
	k8s-deploy-local k8s-apply-local k8s-secrets-local k8s-monitor-local k8s-status-local \
	k8s-build-local-images \
	k8s-deploy-vps k8s-deploy-vps-full k8s-apply-vps k8s-secrets-vps k8s-monitor-vps k8s-status-vps \
	ssh-rsync ssh-scp ssh-shell k8s-deploy-ssh k8s-deploy-ssh-scp k8s-status-ssh

ifneq (,$(wildcard .env.makefile))
include .env.makefile
export
endif

help:
	@echo "=== Deploy Braza Burger ==="
	@echo "Local:"
	@echo "  make k8s-build-local-images"
	@echo "  make k8s-deploy-local"
	@echo "  make k8s-monitor-local"
	@echo "VPS (informar contexto):"
	@echo "  make k8s-deploy-vps KUBE_CONTEXT=seu-contexto"
	@echo "  make k8s-monitor-vps KUBE_CONTEXT=seu-contexto"
	@echo "SSH + rsync (deploy remoto em 1 comando):"
	@echo "  make k8s-deploy-ssh SERVER=$(SERVER)"
	@echo "SSH + scp (fallback Windows sem rsync):"
	@echo "  make k8s-deploy-ssh-scp SERVER=$(SERVER)"
	@echo "Windows sem ssh/scp no PATH (override):"
	@echo "  make k8s-deploy-ssh-scp SERVER=$(SERVER) SSH='C:/WINDOWS/System32/OpenSSH/ssh.exe' SCP='C:/WINDOWS/System32/OpenSSH/scp.exe'"

k8s-build-local-images:
	docker build -f api_manager/Dockerfile.prod -t $(LOCAL_API_IMAGE) ./api_manager
	docker build -f app_cliente/Dockerfile.prod --build-arg API_URL=$(LOCAL_API_URL) -t $(LOCAL_APP_IMAGE) ./app_cliente

k8s-apply-local:
	kubectl apply -k deploy/k8s/manifests
	kubectl -n braza-burger set image deployment/api-manager api-manager=$(LOCAL_API_IMAGE)
	kubectl -n braza-burger set image deployment/app-cliente app-cliente=$(LOCAL_APP_IMAGE)

k8s-secrets-local:
	kubectl apply -f deploy/k8s/manifests/namespace.yaml
	kubectl -n braza-burger create secret generic api-manager-env --from-env-file=api_manager/.env --dry-run=client -o yaml | kubectl apply -f -
	kubectl -n braza-burger create secret generic evolution-env --from-env-file=evolution-api/.env --dry-run=client -o yaml | kubectl apply -f -
	@echo "Secrets locais aplicados."

k8s-monitor-local:
	pwsh -NoProfile -ExecutionPolicy Bypass -File deploy/k8s/scripts/install-monitoring.ps1

k8s-status-local:
	kubectl -n braza-burger get pods
	kubectl -n braza-burger get svc
	kubectl -n braza-burger get ingress
	kubectl -n braza-burger get hpa
	kubectl -n monitoring get pods

k8s-deploy-local: k8s-build-local-images k8s-secrets-local k8s-apply-local k8s-status-local

k8s-apply-vps:
	@if [ -z "$(KUBE_CONTEXT)" ]; then echo "Defina KUBE_CONTEXT"; exit 1; fi
	kubectl --context $(KUBE_CONTEXT) apply -k deploy/k8s/manifests
	kubectl --context $(KUBE_CONTEXT) -n braza-burger set image deployment/api-manager api-manager=$(VPS_API_IMAGE)
	kubectl --context $(KUBE_CONTEXT) -n braza-burger set image deployment/app-cliente app-cliente=$(VPS_APP_IMAGE)
	kubectl --context $(KUBE_CONTEXT) -n braza-burger set image deployment/evolution-api evolution-api=$(VPS_EVOLUTION_IMAGE)
	kubectl --context $(KUBE_CONTEXT) -n braza-burger rollout status deploy/evolution-postgres --timeout=300s
	kubectl --context $(KUBE_CONTEXT) -n braza-burger rollout status deploy/evolution-redis --timeout=300s
	kubectl --context $(KUBE_CONTEXT) -n braza-burger rollout status deploy/evolution-api --timeout=300s
	kubectl --context $(KUBE_CONTEXT) -n braza-burger rollout status deploy/api-manager --timeout=300s || { \
		echo "[k8s-apply-vps] api-manager rollout failed. Collecting diagnostics..."; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger get pods -l app=api-manager -o wide || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger describe deploy/api-manager || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger describe pods -l app=api-manager || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger get events --sort-by=.metadata.creationTimestamp | tail -n 120 || true; \
		exit 1; \
	}
	kubectl --context $(KUBE_CONTEXT) -n braza-burger rollout status deploy/app-cliente --timeout=300s || { \
		echo "[k8s-apply-vps] app-cliente rollout failed. Collecting diagnostics..."; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger get pods -l app=app-cliente -o wide || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger describe deploy/app-cliente || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger describe pods -l app=app-cliente || true; \
		kubectl --context $(KUBE_CONTEXT) -n braza-burger get events --sort-by=.metadata.creationTimestamp | tail -n 120 || true; \
		exit 1; \
	}

k8s-secrets-vps:
	@if [ -z "$(KUBE_CONTEXT)" ]; then echo "Defina KUBE_CONTEXT"; exit 1; fi
	kubectl --context $(KUBE_CONTEXT) apply -f deploy/k8s/manifests/namespace.yaml
	kubectl --context $(KUBE_CONTEXT) -n braza-burger create secret generic api-manager-env --from-env-file=api_manager/.env --dry-run=client -o yaml | kubectl --context $(KUBE_CONTEXT) apply -f -
	kubectl --context $(KUBE_CONTEXT) -n braza-burger create secret generic evolution-env --from-env-file=evolution-api/.env --dry-run=client -o yaml | kubectl --context $(KUBE_CONTEXT) apply -f -
	@echo "Secrets VPS aplicados."

k8s-monitor-vps:
	@if [ -z "$(KUBE_CONTEXT)" ]; then echo "Defina KUBE_CONTEXT"; exit 1; fi
	kubectl --context $(KUBE_CONTEXT) apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
	kubectl --context $(KUBE_CONTEXT) -n kube-system get deploy metrics-server -o jsonpath='{.spec.template.spec.containers[0].args}' | grep -q -- '--kubelet-insecure-tls' || kubectl --context $(KUBE_CONTEXT) -n kube-system patch deployment metrics-server --type='json' -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
	kubectl --context $(KUBE_CONTEXT) -n kube-system rollout status deploy/metrics-server --timeout=300s
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts --force-update
	helm repo update
	kubectl --context $(KUBE_CONTEXT) get ns monitoring >/dev/null 2>&1 || kubectl --context $(KUBE_CONTEXT) create namespace monitoring
	helm upgrade --install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring -f deploy/k8s/monitoring/kube-prometheus-values.yaml --wait --timeout 15m
	kubectl --context $(KUBE_CONTEXT) apply -f deploy/k8s/monitoring/pod-consumption-heatmap-dashboard.yaml

k8s-status-vps:
	@if [ -z "$(KUBE_CONTEXT)" ]; then echo "Defina KUBE_CONTEXT"; exit 1; fi
	kubectl --context $(KUBE_CONTEXT) get pods -A
	kubectl --context $(KUBE_CONTEXT) -n braza-burger get pods
	kubectl --context $(KUBE_CONTEXT) -n braza-burger get svc
	kubectl --context $(KUBE_CONTEXT) -n braza-burger get ingress
	kubectl --context $(KUBE_CONTEXT) -n braza-burger get hpa
	kubectl --context $(KUBE_CONTEXT) -n monitoring get pods

k8s-deploy-vps: k8s-secrets-vps k8s-apply-vps k8s-status-vps

k8s-deploy-vps-full: k8s-secrets-vps k8s-apply-vps k8s-monitor-vps k8s-status-vps

ssh-rsync:
	$(RSYNC) -azv --delete $(RSYNC_EXCLUDES) ./ $(SERVER):$(PROJECT_PATH)

ssh-scp:
	$(SSH) $(SERVER) "mkdir -p $(REMOTE_DIR)"
	$(SCP) -r makefile deploy api_manager app_cliente evolution-api $(SERVER):$(PROJECT_PATH)

ssh-shell:
	$(SSH) $(SERVER)

k8s-deploy-ssh: ssh-rsync
	$(SSH) $(SERVER) "cd $(REMOTE_DIR) && make k8s-deploy-vps-full \
		KUBE_CONTEXT=\"$(KUBE_CONTEXT_REMOTE)\" \
		VPS_API_IMAGE=$(VPS_API_IMAGE) \
		VPS_APP_IMAGE=$(VPS_APP_IMAGE) \
		VPS_EVOLUTION_IMAGE=$(VPS_EVOLUTION_IMAGE)"

k8s-deploy-ssh-scp: ssh-scp
	$(SSH) $(SERVER) "cd $(REMOTE_DIR) && make k8s-deploy-vps-full \
		KUBE_CONTEXT=\"$(KUBE_CONTEXT_REMOTE)\" \
		VPS_API_IMAGE=$(VPS_API_IMAGE) \
		VPS_APP_IMAGE=$(VPS_APP_IMAGE) \
		VPS_EVOLUTION_IMAGE=$(VPS_EVOLUTION_IMAGE)"

k8s-status-ssh:
	$(SSH) $(SERVER) "cd $(REMOTE_DIR) && CTX=\"$(KUBE_CONTEXT_REMOTE)\" && kubectl --context $$CTX get pods -A && kubectl --context $$CTX -n braza-burger get ingress && kubectl --context $$CTX -n monitoring get pods"