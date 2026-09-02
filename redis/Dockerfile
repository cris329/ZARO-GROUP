FROM redis:7-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

EXPOSE 6379

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD redis-cli ping > /dev/null 2>&1 || exit 1

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]