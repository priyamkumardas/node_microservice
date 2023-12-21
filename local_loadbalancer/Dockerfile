FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /etc/nginx/
RUN mkdir -p sarvm_config
RUN mkdir -p sarvm_servers
COPY sarvm_config /etc/nginx/sarvm_config
COPY sarvm_servers /etc/nginx/sarvm_servers