# Stage 1: Build the Angular application
FROM node:18-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Stage 2: Set up the server
FROM node:18-alpine
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist/vald-fc /usr/src/app
CMD ["node", "/usr/src/app/server/server.mjs"]