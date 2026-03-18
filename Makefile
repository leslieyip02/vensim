.PHONY: all build run clean logs shell

IMAGE := vensim:latest
CONTAINER := vensim
PORT := 8080

all: build run

build:
	@docker build -t $(IMAGE) .

run:
	@docker rm -f $(CONTAINER) 2>/dev/null || true
	@docker run -d -p $(PORT):$(PORT) --name $(CONTAINER) $(IMAGE)
	@echo $(CONTAINER) is running at http://localhost:$(PORT)/

logs:
	@docker logs -f $(CONTAINER)

clean:
	@docker rm -f $(CONTAINER) 2>/dev/null || true
