FROM node:14 as base

WORKDIR /home/app/

COPY package.json ./

RUN npm install

COPY . ./