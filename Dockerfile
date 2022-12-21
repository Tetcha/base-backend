FROM node:18-alpine AS builder

WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY . .
RUN yarn run build:prod


FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn", "run", "start:prod"]