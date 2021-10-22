# Stage one: building the application
FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

# Stage two: Running the built code
FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn --production

COPY --from=0 /usr/src/app/dist ./dist

CMD [ "yarn", "start" ]