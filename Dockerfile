FROM node:16.14.2-alpine

WORKDIR /app

COPY ./app/feast_web_app/package.json .
COPY ./app/feast_web_app/package-lock.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi;

COPY ./app/feast_web_app ./

EXPOSE 3000

CMD npm run start