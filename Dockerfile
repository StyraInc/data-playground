FROM node:20-slim AS base
COPY . /app
WORKDIR /app

FROM base AS build
COPY --from=datacatering/duckdb:v1.1.3 /duckdb /usr/local/bin/duckdb
RUN --mount=type=cache,id=npm-data-playground,target=/npm/store npm ci
ENV OBSERVABLE_TELEMETRY_DISABLE=true
RUN npm run build

FROM caddy:latest
EXPOSE 3000
COPY --from=build /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
