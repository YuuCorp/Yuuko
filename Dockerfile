FROM node:20 AS base
RUN useradd -m -u 1001 -s /bin/bash bun

RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun

WORKDIR /usr/src/Yuuko

# Stage: Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage: Prerelease (prepare database & dev steps)
FROM base AS prerelease
WORKDIR /usr/src/Yuuko

COPY package.json bun.lock ./

# Install dev dependencies to run drizzle-kit
RUN bun install --frozen-lockfile

COPY . .

# Run DB migrations if SQLite database doesn't exist
RUN if [ ! -f ./src/database/sqlite/*.sqlite ]; then bun db:push; fi

FROM base AS release
WORKDIR /usr/src/Yuuko

# Copy only production node_modules
COPY --from=install /usr/src/Yuuko/node_modules node_modules

# Copy source code
COPY --from=prerelease /usr/src/Yuuko/src ./src

# Copy config and entrypoint
COPY --from=prerelease /usr/src/Yuuko/package.json .
COPY --from=prerelease /usr/src/Yuuko/tsconfig.json .
COPY --from=prerelease /usr/src/Yuuko/drizzle.config.ts .
COPY --from=prerelease /usr/src/Yuuko/entrypoint.sh .

EXPOSE 3030/tcp
VOLUME "/usr/src/Yuuko/database/sqlite"

CMD bun start:prod