#!/bin/sh

mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/transcendence.crt ]; then
    echo "Génération du certificat SSL auto-signé..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/transcendence.key \
        -out /etc/nginx/ssl/transcendence.crt \
        -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=ft_transcendence/CN=localhost"
    echo "Certificat SSL généré avec succès."
fi

exec "$@"