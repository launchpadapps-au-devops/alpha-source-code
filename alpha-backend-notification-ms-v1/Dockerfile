# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY package-lock.json ./
 
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ARG NPM_AUTH_TOKEN
RUN echo "@launchpadapps-au:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc

RUN npm ci

COPY . ./

RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy over the built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the node_modules directory from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY package*.json ./

ARG PORT=3004
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/main"]
