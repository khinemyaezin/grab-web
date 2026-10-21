# syntax=docker/dockerfile:1

FROM node:22-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .
ARG APP_NAME
RUN turbo prune ${APP_NAME} --docker

FROM node:22-alpine AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

ARG APP_NAME
ENV MF_DTS=0
RUN pnpm turbo run build --filter=${APP_NAME}

FROM nginx:1.27-alpine AS runtime

ARG APP_DIR
ARG NGINX_CONF=nginx.conf
ARG HEALTHCHECK_PATH=/mf-manifest.json

COPY ${APP_DIR}/${NGINX_CONF} /etc/nginx/templates/default.conf.template
COPY --from=build /app/${APP_DIR}/dist /usr/share/nginx/html

ENV API_UPSTREAM=host.docker.internal:8080 \
    NGINX_ENVSUBST_FILTER=API_UPSTREAM \
    HEALTHCHECK_PATH=${HEALTHCHECK_PATH}

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1${HEALTHCHECK_PATH} || exit 1
