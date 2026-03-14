all:
	docker rm -f braza-burger-app || true
	docker build -t braza-burger-app .
	docker run --rm -it -p 80:80 braza-burger-app

up_to_docker-hub:
	docker tag braza-burger-app kuatech/braza-burger-app:latest
	docker push kuatech/braza-burger-app:latest

web_render:
	flutter clean
	flutter build web --release
	python server.py

test_server:
	flutter clean
	flutter build web --release
	python server.py
	cd server && docker build -t braza-burger-app . && docker run --rm -it -p 80:80 braza-burger-app