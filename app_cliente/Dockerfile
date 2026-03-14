FROM ubuntu:20.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Sao_Paulo

RUN apt-get update && apt-get install -y \
    tzdata \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-8-jdk \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário para Flutter
RUN useradd -ms /bin/bash developer
USER developer
WORKDIR /home/developer

# Instalar Flutter
RUN git clone https://github.com/flutter/flutter.git -b stable

ENV PATH="/home/developer/flutter/bin:${PATH}"

RUN flutter doctor
RUN flutter config --enable-web

# Copiar código da aplicação
COPY --chown=developer:developer ../. /home/developer/app
WORKDIR /home/developer/app

# Instalar dependências e fazer build
RUN flutter pub get
RUN flutter build web --release

# Estágio de produção com nginx
FROM nginx:alpine

# Copiar arquivos buildados do Flutter
COPY --from=builder /home/developer/app/build/web /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remover configuração padrão
RUN rm -f /etc/nginx/conf.d/default.conf.dpkg-old

# Configurar permissões
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Usar exec form para melhor handling de sinais
CMD ["nginx", "-g", "daemon off;"]