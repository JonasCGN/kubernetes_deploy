all:
	npm run dev

run_docker:
	docker build -t api_manager-dev .
	docker run -p 3000:3000 -v "$PWD:/app" -v /app/node_modules api_manager-dev