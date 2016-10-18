FROM alpine:edge


WORKDIR /budget-connector

COPY . /budget-connector


RUN apk add -U curl git nodejs && npm install pm2 -g && npm install

EXPOSE 3337

ENV NODE_ENV production
ENV PORT 3337

ENTRYPOINT ["sh", "manage.sh"]

CMD ["run-server"]