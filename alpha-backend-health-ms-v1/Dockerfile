# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

ARG NPM_AUTH_TOKEN
RUN echo "@launchpadapps-au:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN}" >> .npmrc

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy over the built artifacts and node_modules from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/main"]
