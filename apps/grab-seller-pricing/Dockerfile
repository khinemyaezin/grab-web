FROM node:22-alpine AS build

WORKDIR /workspace

RUN npm install -g npm@11.16.0

COPY grab-seller-pricing/package*.json ./grab-seller-pricing/
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    cd grab-seller-pricing \
    && npm ci

COPY grab-seller-pricing ./grab-seller-pricing
RUN cd grab-seller-pricing \
    && npm run build

FROM nginx:1.27-alpine AS runtime

COPY grab-seller-pricing/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/grab-seller-pricing/dist /usr/share/nginx/html

ENV API_UPSTREAM=host.docker.internal:8080 \
    NGINX_ENVSUBST_FILTER=API_UPSTREAM

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/mf-manifest.json || exit 1
