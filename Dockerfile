# Stage 1: Builder
FROM node:20-bullseye-slim AS builder

# Install prerequisites
RUN apt-get update && apt-get install -y curl unzip build-essential pkg-config libssl-dev

# Install Rust for FFI build
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash \
    && ln -s $HOME/.bun/bin/bun /usr/local/bin/bun

# Install all base packages
WORKDIR /usr/src/Yuuko
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Build the Rust FFI module
RUN bun run module:build

# Run DB migrations if SQLite database doesn't exist
RUN mkdir -p ./src/database/sqlite
RUN if [ ! -f ./src/database/sqlite/*.sqlite ]; then bun db:push; fi

# Stage 2: Release
FROM node:20-bullseye-slim AS release
WORKDIR /usr/src/Yuuko

# Install production dependencies and CA certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /root/.bun /root/.bun
ENV PATH="/root/.bun/bin:${PATH}"

# Install production-only dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile -p

# Copy source and compiled FFI
COPY --from=builder /usr/src/Yuuko/src ./src
COPY --from=builder /usr/src/Yuuko/package.json \
                     /usr/src/Yuuko/tsconfig.json \
                     /usr/src/Yuuko/drizzle.config.ts \
                     /usr/src/Yuuko/entrypoint.sh ./

EXPOSE 3030/tcp
VOLUME "/usr/src/Yuuko/src/database/sqlite"

CMD bun start