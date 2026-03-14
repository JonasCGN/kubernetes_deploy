FROM nginx:alpine

# Limpa a instalação padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do build
COPY ./build/web /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Configura permissões
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]