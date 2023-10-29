FROM NODE:16
# install bun from here curl -fsSL https://bun.sh/install | bash
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://bun.sh/install | bash && \
    apt-get remove -y curl && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/Yuuko
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --ignore-engines
COPY . .
RUN mkdir -p ./src/RSA && \
    [ ! -f ./src/RSA/id_rsa ] && ssh-keygen -m PEM -t rsa -f ./src/RSA/id_rsa -C id_rsa || echo "RSA keys already exist"
CMD [ "bun" ,"run" ,"app.ts"]