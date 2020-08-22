
FROM node:lts-alpine 
 
RUN mkdir -p /usr/src/app/node_modules 
 
WORKDIR /usr/src/app
 
COPY package.json yarn.* ./ 
 
RUN yarn 
 
COPY . . 
 
EXPOSE 3333 
 
ENTRYPOINT [ "./init.sh" ] 
