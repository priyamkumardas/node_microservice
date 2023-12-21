# USER MGMT SERVICE
This project provides the source code for the api and the underlying db access layer written and maintained in nodejs using expressjs.


# Project setup steps
## Pre-requisites 
- Ensure you have installed node js 17 on your system.

## Steps
- Run npm install
- Create one .env.dev file on you local and past the following settings on it

- `NOTE: Ask settings vearibales to any of the backend developers Or RP and past those in .env.dev.`
- Run npm i
- Run npm run dev

You will see the following response if server runs successfull. 
```
> user_mgmt_service@1.0.0 dev
> nodemon -r dotenv/config ./server dotenv_config_path=./.env.dev

[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r dotenv/config ./server dotenv_config_path=./.env.dev ./server.js`
{ msg: 'Base URL: http://localhost:1205/apis/v1/' }
Mongodb Connected successfully
```

