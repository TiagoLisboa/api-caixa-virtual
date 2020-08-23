
FROM node:lts-alpine 
 
RUN mkdir -p /usr/src/app/node_modules 
 
WORKDIR /usr/src/app
 
COPY package.json yarn.* ./ 
 
RUN yarn 
 
COPY . . 
 
EXPOSE 3333 

# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
 
ENTRYPOINT [ "./init.sh" ] 
