FROM node:10.15.2-slim

ADD package.json package.json
RUN npm install
ADD . .


CMD ["node", "index.js"]
