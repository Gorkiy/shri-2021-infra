FROM node:14-alpine

COPY . .

RUN npm install --silent

RUN echo "Docker container has been buil succesfully"