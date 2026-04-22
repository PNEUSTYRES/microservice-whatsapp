FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm i

EXPOSE 3060
