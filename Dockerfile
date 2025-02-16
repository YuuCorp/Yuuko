#FROM oven/bun:1.1.4 as base
FROM node:20 AS base
RUN useradd -m -u 1001 -s /bin/bash bun

# install bun from here curl -fsSL https://bun.sh/install | bash
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun

WORKDIR /usr/src/Yuuko

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
# Copy bun patches folder so we can install the patches
COPY patches /temp/prod/patches
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY . .
ENV NODE_ENV=docker

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/Yuuko/src ./src

COPY --from=prerelease /usr/src/Yuuko/entrypoint.sh .
COPY --from=prerelease /usr/src/Yuuko/package.json .
COPY --from=prerelease /usr/src/Yuuko/tsconfig.json .
COPY --from=prerelease /usr/src/Yuuko/drizzle.config.ts ..

EXPOSE 3030/tcp

VOLUME "usr/src/Yuuko/database/sqlite"

ENTRYPOINT [ "sh", "entrypoint.sh" ]
