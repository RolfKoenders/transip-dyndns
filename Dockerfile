FROM tarampampam/node:11.10-alpine

ADD package.json package.json

RUN apk add --no-cache make gcc g++ python && \
    npm install --prod && \
    npm cache clean --force && \
    apk del make gcc g++ python 

ADD . .

CMD npm run start
