FROM oven/bun:latest
WORKDIR /usr/src/Yuuko
COPY package.json ./
COPY bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN mkdir -p ./src/RSA && \
    [ ! -f ./src/RSA/id_rsa ] && ssh-keygen -m PEM -t rsa -f ./src/RSA/id_rsa -C id_rsa || echo "RSA keys already exist"
CMD [ "bun" ,"run" ,"app.ts"]