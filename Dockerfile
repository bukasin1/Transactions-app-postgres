FROM node:fermium AS server

WORKDIR /tmp/server

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY . .

RUN yarn tsc

#Install tini
FROM node:fermium AS tini

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

# Build app
FROM node:fermium as app

COPY --from=tini /tini /tini

ENV NODE_ENV production
LABEL Maintainer="Omenebele - Transaction App"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile --production

COPY bin bin
COPY --from=server /tmp/server/dist dist

ENTRYPOINT ["/tini", "--"]

EXPOSE 3005
CMD [ "node", "bin/www" ]
