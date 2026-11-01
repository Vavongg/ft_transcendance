FROM nginx:1.27-alpine

# Mettre à jour les dépendances OS pour patcher les CVE
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache openssl

COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY tools/ssl.sh /usr/local/bin/ssl.sh

RUN chmod +x /usr/local/bin/ssl.sh

ENTRYPOINT ["/usr/local/bin/ssl.sh"]
CMD ["nginx", "-g", "daemon off;"]