# reference: https://mherman.org/blog/dockerizing-a-react-app/

FROM node:latest

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
