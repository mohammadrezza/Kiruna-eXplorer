FROM node:20 AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install --silent
COPY ./ ./
RUN npm run build

FROM nginx:1.19.0 AS runner
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]