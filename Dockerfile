FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

RUN apk upgrade --no-cache && \
    apk add --no-cache libstdc++

# ----------------------------------------------------------------
# ----------------------------------------------------------------
# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev/app
RUN mkdir -p /temp/dev/server

COPY package.json bun.lockb /temp/dev/
COPY app/package.json /temp/dev/app/
COPY server/package.json /temp/dev/server/

RUN cd /temp/dev && bun install --frozen-lockfile

# ----------------------------------------------------------------
# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
ENV YPERSISTENCE=../db

RUN bun run build

# ----------------------------------------------------------------
# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /usr/src/app/server server
COPY --from=prerelease /usr/src/app/package.json .

RUN mkdir -p node_modules/leveldown
COPY --from=prerelease /usr/src/app/node_modules/leveldown node_modules/leveldown

VOLUME /usr/src/app/db

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
