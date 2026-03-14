# syntax=docker/dockerfile:1

# 1. Build client
FROM node:24-alpine AS client
WORKDIR /app

COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build server
FROM golang:1.24 AS server
WORKDIR /app

COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./server/
COPY --from=client /app/dist ./server/dist
WORKDIR /app/server
RUN CGO_ENABLED=0 GOOS=linux go build -o /server

# 3. Final image
FROM debian:bookworm-slim
WORKDIR /app

COPY --from=server /server /server
COPY --from=server /app/server/dist ./dist

CMD ["/server"]