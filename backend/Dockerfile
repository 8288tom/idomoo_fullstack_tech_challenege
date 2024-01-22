# Backend Dockerfile
FROM node:latest

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

EXPOSE 5172

CMD ["npx", "nodemon", "app.js"]
