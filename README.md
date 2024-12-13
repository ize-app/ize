# Ize

## Running Ize locally

### Setting up local dev environment

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

### Running in dev mode

Runs in dev mode with hot module reloading on both the backend server and frontend Vite server. Note that frontend assets are served differently in dev than during production. In development, a Vite server serves static assets whereas in production, these assets are served by express server

Run the frontend

`cd apps/frontend && npm run dev`

Build the database and run the backend

`cd apps/backend && npx prisma db push && npm run start:dev`

Navigate to [127.0.0.1](http://127.0.0.1/)


### Testing production build locally

Build backend and frontend.

`npm run build`

This will build both the frontend and backend. Frontend dist files are output in backend dist folder.

Start the express server

`cd apps/backend && npm run start:prod`

Navigate to [127.0.0.1](http://127.0.0.1v)

This method of running the production build serves assets from the express server. An alternate method of just testing the production build of the frontend is to run `npm run preview` in the frontend app and navigate to [127.0.0.1](127.0.0.1)

## Debugging production build

### Monitoring

- [Sentry](https://ize.sentry.io/issues/): Error monitoring for FE and BE
- [Google Analytics](https://analytics.google.com/analytics/web/#/p445559371/reports/intelligenthome): Basic traffic monitoring. Fully client-side so some traffic is being blocked but it gives us a "good enough" answer for now.
- [Render](https://dashboard.render.com/): Basic performance monitoring and logs

### Connecting to prod db

For most queries, you should be using the read-only `analytics_user`. To connect to the db via the command line.

`psql -h <hostname> -U analytics_user izedb`

Find the hostname in the dashboard for izedb on Render.

In the rare case you need to write to the db, you can find the superuser credentials on Render.

## Development workflow

### Updating database schema

Ize uses Prisma as its ORM. The database schema is defined via the Prisma schema at `apps/backend/src/prisma/schema.prisma`.

To quickly prototype schema changes during development, run `npx prisma db push` from `apps/backend` to update the schema of your local db and prisma client. This command is only to be used during development, as it doesn't track database changes that can later be applied to the production db via a schema migration.

`prisma migrate dev --name [[name]]` is used in dev when you do want to keep track of changes so that they can be applied by `prisma migrate deploy` later in CI. this command creates migration file, applies them to database, and updates pigrations table. you can use `--create-only` flag to edit a migration so you don't get data loss during the migration (learn more [here](https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations)).

Migrations are applied to the production database automatically via `prisma migrate deploy`

### Updating GraphQL

When you make an update to the GraphQL schema or queries, run `npm run codegen` to automatically generate GraphQL types in the frontend and backend apps.

## Concepts

### Users and Identities

Users authenticate into Ize via identities. Users can have multiple identities. Identities we currently support are:

- Email
- EVM address
- Discord account

### Groups

Groups are shorthand for a set of identities. There are multiple ways a group can be defined.

- **Custom Ize group**: A list of Ize identites and groups
- **NFT**: A blockchain identity is part of this group if it currently owns that 721/1155 NFT (validated by Alchemy)
- **Hats**: A blockchain identity is part of this group if it is assigned that particular Hat and that Hat is active
- **Discord Role**: A Discord idenity is part of this group if it holds a particular discord Role
- **Discord Server**: A Discord idenity is part of this group if it is part of a Discord server.

### Flows

Flows define how a particular identities/groups collaborate to complete some kind of task. Flows have the following components

- **Request permissions**: Identities/groups that can trigger this flow (i.e. create a request)
- **Request fields**: Information that is required for someone to trigger the flow
- **Response permissions**: Identities/groups that can respond a
- **Response fields**: Information that is required on a response
- **Results**: How response fields are aggregated into a final result (e.g. decision, AI summary, prioritization, etc)
- **Actions**: Automated actions that occur when a request complets (e.g. fire a webhook, evolve a flow, etc)

Everything that happens in Ize happens via collaborative flows. Even the process to evolve a flow happens via another flow.

### Requests

An instance of a flow being triggered is a request. There can be many requests to a single flow.

Requests can (but don't necessarily) have responses.
