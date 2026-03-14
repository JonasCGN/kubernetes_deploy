# Dockerfile para ambiente de desenvolvimento Node.js + TypeScript + Nodemon
FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão
EXPOSE 3000

# Comando para rodar em modo dev (hot reload)
CMD ["npm", "run", "dev"]
