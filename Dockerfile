FROM node:14-alpine

WORKDIR /express

COPY . .

RUN npm i

EXPOSE 8080

CMD [ "npm", "run", "start" ]