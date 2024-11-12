FROM node:20
WORKDIR /app
COPY ./package*.json ./
RUN npm install --silent
COPY . .
EXPOSE 3001
CMD ["node", "index.mjs" ]