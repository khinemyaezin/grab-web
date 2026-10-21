# syntax=docker/dockerfile:1

FROM node:22.23-alpine AS build

WORKDIR /workspace

ARG APP_DIR
COPY ${APP_DIR}/package.json ${APP_DIR}/package-lock.json ${APP_DIR}/
WORKDIR /workspace/${APP_DIR}

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    --mount=type=cache,id=grab-npm,target=/root/.npm \
    npm ci

COPY ${APP_DIR}/ ./

ENV MF_DTS=0
RUN npx vite build

FROM nginx:1.27-alpine AS runtime

ARG APP_DIR
ARG NGINX_CONF=nginx.conf
ARG HEALTHCHECK_PATH=/mf-manifest.json

COPY ${APP_DIR}/${NGINX_CONF} /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/${APP_DIR}/dist /usr/share/nginx/html

ENV API_UPSTREAM=host.docker.internal:8080 \
    NGINX_ENVSUBST_FILTER=API_UPSTREAM \
    HEALTHCHECK_PATH=${HEALTHCHECK_PATH}

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1${HEALTHCHECK_PATH} || exit 1
