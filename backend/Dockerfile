FROM golang:1.20

COPY . /home/app

WORKDIR /home/app

RUN env GOOS=linux \
    go build -o bin/main

CMD [ "bin/main" ]