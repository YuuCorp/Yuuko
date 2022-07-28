FROM node:16
WORKDIR /usr/src/Yuuko
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "node", "app.js" ]