ARG NODE_VERSION=22.2.0

FROM node:${NODE_VERSION}-slim as base

RUN apt upgrade \
    & addgroup --gid 1001 i2mo \
    & adduser --uid 1001 --gid 1000 i2mo

USER i2mo

COPY --chown=i2mo:i2mo . /I2MO/app
WORKDIR /I2MO/app

RUN npm install && npm run build
ENTRYPOINT [ "node",".output/server/index.mjs" ]