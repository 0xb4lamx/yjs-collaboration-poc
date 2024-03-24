FROM oven/bun:1-alpine as base
WORKDIR /usr/src/app

RUN apk upgrade --no-cache && \
    apk add --no-cache libstdc++

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

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod/app
RUN mkdir -p /temp/prod/server

COPY package.json bun.lockb /temp/prod/
COPY app/package.json.empty /temp/prod/app/package.json
COPY server/package.json /temp/prod/server/

RUN cd /temp/prod && bun install --frozen-lockfile --production

# ----------------------------------------------------------------
# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# build frontend app
ENV NODE_ENV=production
RUN bun run build

# ----------------------------------------------------------------
# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/server server
COPY --from=prerelease /usr/src/app/package.json .

VOLUME /usr/src/app/db

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
