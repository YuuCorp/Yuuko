FROM oven/bun:1.1.4 as base
WORKDIR /usr/src/Yuuko

FROM base AS install

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY . .
ENV NODE_ENV=production

FROM base AS release

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/Yuuko/src ./src
RUN chown -R bun:bun /usr/src/Yuuko/src

COPY --from=prerelease /usr/src/Yuuko/package.json .
COPY --from=prerelease /usr/src/Yuuko/tsconfig.json .
COPY --from=prerelease /usr/src/Yuuko/drizzle.config.ts .
COPY --from=prerelease /usr/src/Yuuko/drizzle.stats.config.ts .

VOLUME /usr/src/Yuuko/src/database
VOLUME /usr/src/Yuuko/src/RSA

USER bun
EXPOSE 3030/tcp
ENTRYPOINT [ "bun", "start:prod" ]