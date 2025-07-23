FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /usr/src

RUN apk add --no-cache python3 make g++

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent

COPY . .

EXPOSE 5000

RUN chown -R node /usr/src
USER node

CMD ["node", "src/index.js"]
