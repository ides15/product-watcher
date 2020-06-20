FROM golang:alpine AS builder

WORKDIR /app

# Add certificates
RUN apk --update add ca-certificates

# Install dependencies
COPY go.mod go.mod
RUN go mod download

# Copy app over
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build product-watcher

# ---

FROM scratch

# Copy certs, binary, and products JSON
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /app/product-watcher /product-watcher
COPY --from=builder /app/products.json /products.json

ENV ENV=production

# Start app
ENTRYPOINT [ "/product-watcher" ]
