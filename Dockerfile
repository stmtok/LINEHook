FROM node:erbium as builder
WORKDIR /build

COPY ./tsconfig.json ./
COPY ./tslint.json ./
COPY ./yarn.lock ./
COPY ./package.json ./
RUN yarn install

COPY ./src/ ./src
RUN yarn build

FROM node:erbium-slim
WORKDIR /app

COPY --from=builder /build/node_modules/ ./node_modules
COPY --from=builder /build/dist/ ./dist

EXPOSE 3000

CMD ["node", "./dist/index.js"]
