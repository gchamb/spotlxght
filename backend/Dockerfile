FROM golang:1.20

COPY . /home/server

WORKDIR /home/server

RUN env GOOS=linux \
    go build -o bin/main

CMD [ "bin/main" ]