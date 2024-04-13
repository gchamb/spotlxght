FROM golang:1.20

ENV PORT 3000

COPY . /home/app

WORKDIR /home/app

RUN env GOOS=linux \
    go build -o bin/main

CMD [ "bin/main" ]