# Valiu backend challenge

A microservice that takes screenshot of a website given its URL and returns the image’s URL.

# Technologies Used

- Backend: Node/Express
- typescript
- amqplib(Rabbitmq)
- Libaries: Es6, Babel, eslint, supertest, express

# env sample

- PORT=3300
- NODE_ENV=
- ACCESS_KEYID=
- SECRET_ACCESS_KEY=
- SPACE_ENDPOINT=
- BUCKET=
- UPLOAD_URI={baseuri}/api/upload

# Features

- User can get a screenshot image url of a website

## API Endpoints

| Endpoint                | Functionality            |
| ----------------------- | ------------------------ |
| POST /api/v1/screenshot | Get screenshot image url |
| GET /                   | API Health               |

[Documentation](https://documenter.getpostman.com/view/10646382/TVev44uP)

# To Install

- Download or clone
- Open terminal inside the root directory of clone folder
- Type `npm install` to install all dependencies
- `npm start` to run the app
- `npm run dev` to run development environment
- `npm test` to run the test suits on the app

## AUTHOR

[Kayode Adeyemi](https://github.com/karosi12)
