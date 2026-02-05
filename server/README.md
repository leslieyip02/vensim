# Vensim++ Server

## Getting Started

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
go test -cover ./env ./graph ./id ./room ./timeout ./ws -coverprofile=coverage.out
```
