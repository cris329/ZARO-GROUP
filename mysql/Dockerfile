FROM mysql:8.0

# Configuración de seguridad para MySQL
COPY my.cnf /etc/mysql/conf.d/security.cnf

# Scripts
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
COPY backup.sh /usr/local/bin/backup.sh
COPY restore.sh /usr/local/bin/restore.sh
COPY healthcheck.sh /usr/local/bin/healthcheck.sh

RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh /usr/local/bin/healthcheck.sh

EXPOSE 3306

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
    CMD ["healthcheck.sh", "-h", "localhost"]

CMD ["mysqld"]