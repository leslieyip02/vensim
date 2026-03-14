# Server

## Getting Started

1. Start the server

```
go install
go run main.go
```

If you want to serve the frontend SPA, you will first need to build the frontend:

```
cd ../client
npm ci
npm run build

cd ../server
cp ../client/dist .
```

2. Testing

```
go test ./...
go test -cover ./env ./graph ./id ./room ./timeout ./ws -coverprofile=coverage.out
```
