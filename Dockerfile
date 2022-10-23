FROM nginx:1-alpine
COPY ./dist /usr/share/nginx/html
COPY ./docker-webapp-startup.sh /docker-entrypoint.d/docker-webapp-startup.sh
RUN chmod +x /docker-entrypoint.d/docker-webapp-startup.sh