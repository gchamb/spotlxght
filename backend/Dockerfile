FROM golang:1.20

WORKDIR /app

COPY . .

RUN env GOOS=linux GOARCH=arm go build

# RUN chmod +x /bin/main

# build go application
CMD [ "./backend" ]



