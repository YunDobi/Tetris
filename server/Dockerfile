FROM node

WORKDIR /Users/yun/Desktop/work/tetris/server

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 9000

CMD [ "node", "server.js" ]