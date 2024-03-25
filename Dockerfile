FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

RUN apk upgrade --no-cache && \
    apk add --no-cache libstdc++

# ----------------------------------------------------------------
# install and build the app
FROM base AS builder

COPY . .
RUN bun install --frozen-lockfile

ENV NODE_ENV=production
ENV YPERSISTENCE=../db

RUN bun run build

# ----------------------------------------------------------------
# copy production dependencies and source code into final image
FROM base AS release
COPY --from=builder /usr/src/app/server server
COPY --from=builder /usr/src/app/package.json .

RUN mkdir -p node_modules/leveldown
COPY --from=builder /usr/src/app/node_modules/leveldown node_modules/leveldown

VOLUME /usr/src/app/db

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
