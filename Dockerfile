# Stage one: building the application
FROM node:alpine as build

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV DOCKER_ENV=yes

RUN yarn build

# Stage two: Running the built code
FROM node:alpine as run

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && yarn --production \
    && apk del build-dependencies

RUN npm install -g node-gyp

RUN yarn add argon2

COPY --from=build /usr/src/app/dist ./dist

CMD [ "yarn", "start" ]