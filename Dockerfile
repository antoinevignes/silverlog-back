# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine

# Ajouter les outils de compilation pour bcrypt et autres dépendances natives
RUN apk add --no-cache python3 make g++

ENV NODE_ENV production
WORKDIR /usr/src/app

COPY package*.json ./

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

RUN apk del python3 make g++

COPY . .

USER node

EXPOSE 3000

CMD node app.js
