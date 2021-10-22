# Stage one: building the application
FROM node:17-buster

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV DOCKER_ENV=yes

RUN yarn build

# Stage two: Running the built code
FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn --production

RUN npx node-pre-gyp rebuild -C ./node_modules/argon2

COPY --from=0 /usr/src/app/dist ./dist

CMD [ "yarn", "start" ]