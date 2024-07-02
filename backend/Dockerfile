# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

# Base image
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

# Deps stage
FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Build stage
FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Ensure the config and migrations directories are copied
COPY config ./config
COPY migrations ./migrations

RUN npm run compile

# Final stage
FROM base as final

ENV NODE_ENV production

USER node

COPY package.json .

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/migrations ./migrations

EXPOSE 3000

CMD ["sh", "-c", "npx sequelize-cli db:migrate --config ./config/config.js && npm run prod"]
