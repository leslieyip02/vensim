# Vensim

## Getting Started

1. Build the image

```
docker build -t vensim:latest .
```

2. Start the server

```
docker run --detach --publish 8080:8080 vensim:latest

# inspect logs
docker ps --all
docker logs <CONTAINER ID>
```

3. Stop the server

```
docker ps --all
docker stop <CONTAINER ID>
docker rm <CONTAINER ID>
```

The client can also be run separately from the server for hot reloading (e.g. client on localhost:5173 and server on localhost:8080).
You can find the instructions [here](./client/README.md) and [here](./server/README.md).
