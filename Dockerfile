FROM nginx:1.17.5-alpine
MAINTAINER gts

ENV RUN_GROUP nginx
ENV DATA_DIR /home/www/dist
ENV SERVER data-open-engine-be-daily-http:8080

# 复制打包产物到容器的/home目录
COPY ./dist /home/www/dist

COPY ./docker/nginx/conf.d /etc/nginx/conf.d
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.template


# 指定执行的工作目录
WORKDIR /home/www

EXPOSE 8080

#CMD 运行以下命令
CMD ["/bin/sh", "-c", "envsubst '$SERVER' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
# CMD ["nginx", "-g", "daemon off;"]
