FROM node:16-alpine3.12

WORKDIR /user/src/app

COPY --chown=node:node ./back .

RUN npm ci

CMD ["node", "index.js"]