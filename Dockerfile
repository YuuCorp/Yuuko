FROM node:16
WORKDIR /usr/src/anisuggest
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "node", "app.js" ]