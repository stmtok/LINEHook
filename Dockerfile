FROM node:erbium as builder
WORKDIR /build

COPY ./tsconfig.json ./
COPY ./tslint.json ./
COPY ./yarn.lock ./
COPY ./package.json ./
COPY ./src/ ./src

RUN yarn install && yarn build

FROM node:erbium-alpine
WORKDIR /app
COPY --from=builder /build/node_modules/ ./node_modules
COPY --from=builder /build/dist/ ./dist

RUN addgroup -S app && \ 
    adduser -S app -G app
    
USER app

EXPOSE 3000
ENV DEBUG=server

CMD ["node", "./dist/index.js"]