FROM golang:1.20-alpine

WORKDIR /app

COPY server/ ./

RUN go mod init ex5_server && \
    go mod tidy && \
    go build -o main .

EXPOSE 8080

CMD ["./main"]