# Vensim++ Server

## Getting Started

### Local Development

1. Create an `.env` file

```
# example
HOST=localhost
PORT=8080
```

2. Start the server

```
go install
go run main.go
```

3. Testing

```
go test ./...
go test -cover ./env ./graph ./id ./room ./timeout ./sim ./ws -coverprofile=coverage.out
```

### Dockerized Build

1. Start the server

```
# build the image
docker build -t server:latest .
docker run --detach --publish 8080:8080 server:latest

# inspect logs
docker ps --all
docker logs <CONTAINER ID>
```

2. Stop the server

```
docker ps --all
docker stop <CONTAINER ID>
docker rm <CONTAINER ID>
```
