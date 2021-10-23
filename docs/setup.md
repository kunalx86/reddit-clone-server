# Running the code
This project can run be ran using Docker or you can build it on your own

## Environment files
- `.env` file contains environment variables needed in `compose.yml` file.
- `env/` folder contains the sample environemnt file that `docker-compose` will use.
- `src/pre-start/env/` contains the sample environment files for development and production presets that will be used if you prefer to run code on your own.
- All variables are explained in [`./environment_variables.md`](./environment_variables.md)

## Necessary dependancies
- The database used is `Postgresql` with it's configuration in environment files, the docker-compose configuration already includes Postgres image. You may use other database but that would involve some code changes and you may need to regenerate the `migrations`.
- `Redis` is used to manage sessions. You will need it installed and the docker-compose configuration already exists.
- [`Cloudinary`](https://cloudinary.com/) is used to store images. You will need to create an account and get your api keys and url and save it in the `env` file(s). You can use your filesystem if you want however, that would involve a lot of changes to the code. You may check previous git commit where I implemented for local filesystem

## Running using Docker
- The project includes the `Dockerfile` that builds the image and a docker-compose configuration in `compose.yml` file is included that can run the app in a single command.
- First ensure you rename the environment files `.env` in root and `production.docker.env` in `env/`, add all the appropriate variables value.
- Run command:\
`$: docker-compose up --build`
- This will create folders `postgres_data/` and `redis_data/` (ignored by both Git and Docker), if you delete these you will lose your data.
- The app will automatically try to apply migrations once it is run, so ensure that correct database is being used or else you will lose the data.
- Only issue is that you will need root permission to delete both postgres and redis data folders.

## Running on your own
- The `package.json` includes appropriate scripts that can run the app in both development and production mode.
- Use `yarn` to install packages by running:\
`$: yarn`
- Then to run app in development mode run the command:\
`$: yarn start:dev`
- If you wish to build the code, run:\
`$: yarn build`
- To run the built version of code, run:\
`$: yarn start`
- While building the app ensure that there is no environment variable by the name of `DOCKER_ENV` set to "yes", as it is used to conditionally copy the environment file, if it is set the file will not copy and app will not run as intended.