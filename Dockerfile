FROM node:16-alpine

WORKDIR /express

COPY . .

RUN npm ci

EXPOSE 8080

CMD [ "npm", "run", "start" ]