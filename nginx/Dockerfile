FROM nginx:1.25-alpine

# Configuración de seguridad y proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security.conf /etc/nginx/conf.d/security.conf
COPY gzip.conf /etc/nginx/conf.d/gzip.conf

# Eliminar configuración default
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]