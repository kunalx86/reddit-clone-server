# Environment Variables
- This project makes use of environment variables to manage sensitive information like passwords, api keys, session secrets etc. 
- `.env` files are used to manage these variables.
- There are mainly there types of these files mainly for Docker, Docker compose, Development/Production mode.
- These files are not tracked by Git and hence an example variant is provided as a template.
- Execute `setup.sh` to rename these files appropriately.

## Variables
- DOCKER_ENV: Set it to yes only for Docker
- PORT, HOST: Port and Host for your server
- DB_USER: User to be used for your database
- DB_PASSWORD: Password for the user
- DB_NAME: Name of the database for your app
- DB_URL: Host address/url of your database server
- REDIS_HOST: Host address/url of your redis server
- REDIS_PORT: Port number where your redis server is listening on
- SESSION_SECRET: A long random string that will be used to validate the cookie to manage session, use a strong string here
- CLOUD_NAME: Visit `Cloudinary Console`
- API_KEY: Visit `Cloudinary Console`
- API_SECRET: Visit `Cloudinary Console`
- CLOUDINARY_URL: Visit `Cloudinary Console`
- POSTGRES_PASSWORD: Same as DB_PASSWORD
- POSRGRES_USER: Same as DB_USER
- POSTGRES_DB: Same as DB_NAME
(You can leave Jet Logger one as it is)