#Transaction-App

Instructions to follow.

This is contains a transaction api to transfer money between accounts.

It is written in typescript and has been containerized using Docker.

run `docker-compose up` to start the container.

To make a transfer the endpoint is `localhost:3005/api/transfer`

You can test the api on postman with the request body containing the following keys:
`from, to, amount, description`
