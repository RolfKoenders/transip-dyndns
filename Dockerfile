FROM node:10.15.2

ADD package.json package.json
RUN npm install
ADD . .

CMD npm run start
