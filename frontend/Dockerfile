FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 5173

CMD [ "yarn", "test" ]
