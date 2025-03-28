# Local setup

Create a port forwarding tunnel from port 3000. You can use a service like ngrok or vs code. Set the address in the backend env file. This is used so that external services like Telegram API can communicate with local server via SSL.

```
PORT_FORWARDING_ADDRESS=""
```

Use .env.sample to create your backend env file. Email ize.inquiries@gmail.com if you're interested in developing Ize and getting access to existing running infrastructure. Otherwise, you'll need to add your own API keys for Stytch, Alchemy, OpenAI, Discord, and Telegram.

## Running Ize in dev mode

Runs in dev mode with hot module reloading on both the backend server and frontend Vite server. Note that frontend assets are served differently in dev than during production. In development, a Vite server serves static assets whereas in production, these assets are served by express server

Build the database and run the backend

```sh
docker compose up
```

Run the frontend.

```sh
npm i
cd apps/frontend && sudo npm run dev
```

The reason we're running sudo here is because the Telegram login widget needs access to port 80 to work. This is definitely not ideal and something we should fix so contributors don't need to run sudo.

`sudo` is only needed to access port 80.

Navigate to [127.0.0.1](http://127.0.0.1/)

## Development workflow

### Updating database schema

Ize uses Prisma as its ORM. The database schema is defined via the Prisma schema at `apps/backend/src/prisma/schema.prisma`.

To quickly prototype schema changes during development, run `npx prisma db push` from `apps/backend` to update the schema of your local db and prisma client. This command is only to be used during development, as it doesn't track database changes that can later be applied to the production db via a schema migration.

`prisma migrate dev --name [[name]]` is used in dev when you do want to keep track of changes so that they can be applied by `prisma migrate deploy` later in CI. this command creates migration file, applies them to database, and updates the migrations table. you can use `--create-only` flag to edit a migration so you don't get data loss during the migration (learn more [here](https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations)).

Migrations are applied to the production database automatically via `prisma migrate deploy`

### Updating GraphQL

When you make an update to the GraphQL schema or queries, run `npm run codegen` to automatically generate GraphQL types in the frontend and backend apps.

## Testing production build locally

Build backend and frontend.
```sh
npm run build
```

This will build both the frontend and backend. Frontend dist files are output in backend dist folder.

Start the express server

```
cd apps/backend && npm run start:prod
```

Navigate to [127.0.0.1](http://127.0.0.1v)

This method of running the production build serves assets from the express server. An alternate method of just testing the production build of the frontend is to run `npm run preview` in the frontend app and navigate to [127.0.0.1](127.0.0.1)
