FROM node:22.11.0-alpine AS dev

WORKDIR /app

COPY ../package*.json ./

RUN npm ci

COPY .. .

CMD ["npm", "run", "dev"]

# PRODUCTION

FROM node:22.11.0-alpine AS prod

WORKDIR /app

COPY ../package*.json ./

RUN npm ci --only=production

COPY .. .

CMD ["node", "app.js"]