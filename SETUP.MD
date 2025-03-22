# Local setup

## Setting up local dev environment

Install Homebrew

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Install Postgres 16

`brew install postgresql@16`

Run Postgres

`brew services start postgresql@16`

Create database

`createdb izedev`

Install nvm

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`

Install packages

`npm i`

Update local database schema with prisma schema

`cd apps/backend && npx prisma db push`

Add database URL to your backend env file.

```
DATABASE_URL="postgresql://<username>@localhost:5432/izedev"
```

Create a port forwarding tunnel from port 3000. You can use a service like ngrok or vs code. Set the address in the backend env file. This is used so that external services like Telegram API can communicate with local server via SSL.

```
PORT_FORWARDING_ADDRESS=""
```

Use .env.sample to create rest of your backend env file.

## Running in dev mode

Runs in dev mode with hot module reloading on both the backend server and frontend Vite server. Note that frontend assets are served differently in dev than during production. In development, a Vite server serves static assets whereas in production, these assets are served by express server

Run the frontend

`sudo cd apps/frontend && npm run dev`

Build the database and run the backend

`cd apps/backend && npx prisma db push && npm run start:dev`

Navigate to [127.0.0.1](http://127.0.0.1/)

## Testing production build locally

Build backend and frontend.

`npm run build`

This will build both the frontend and backend. Frontend dist files are output in backend dist folder.

Start the express server

`cd apps/backend && npm run start:prod`

Navigate to [127.0.0.1](http://127.0.0.1v)

This method of running the production build serves assets from the express server. An alternate method of just testing the production build of the frontend is to run `npm run preview` in the frontend app and navigate to [127.0.0.1](127.0.0.1)

## Development workflow

### Updating database schema

Ize uses Prisma as its ORM. The database schema is defined via the Prisma schema at `apps/backend/src/prisma/schema.prisma`.

To quickly prototype schema changes during development, run `npx prisma db push` from `apps/backend` to update the schema of your local db and prisma client. This command is only to be used during development, as it doesn't track database changes that can later be applied to the production db via a schema migration.

`prisma migrate dev --name [[name]]` is used in dev when you do want to keep track of changes so that they can be applied by `prisma migrate deploy` later in CI. this command creates migration file, applies them to database, and updates the migrations table. you can use `--create-only` flag to edit a migration so you don't get data loss during the migration (learn more [here](https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations)).

Migrations are applied to the production database automatically via `prisma migrate deploy`

### Updating GraphQL

When you make an update to the GraphQL schema or queries, run `npm run codegen` to automatically generate GraphQL types in the frontend and backend apps.