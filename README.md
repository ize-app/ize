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

## Technical context

### Entities > identities, users, groups

### How users are associated to flows and groups

#### Watching flows

For now, we're only mappping users but not identities to flows. A user is mapped to a flow only when they affirmatively confirm they want to watch a flow. This happens

- On flow page or flows table 
- User automatically watches any custom flows they create. (TBD should shis also include default flows of the groups they create)
- When user creates request / response, they can affirm whether they want to watch future activity in that flow



#### Watching groups

Similarly, a user is associated with watching a group in two situations

1. They affirmatively confirm they want to watch the group on the groups/group page
2. In the GroupInvitations component we show all groups that a user is a member of, but they haven't confirmed they want to watch / not watch. 
3. (TBD) When a Telegram identity creates or participates in a flow directly from Telegram, we have that entity watch the group. The reason we do this is that there are limitations on how we can query for a Telegram identities groups, so we want to actively find ways to associate a user to a group

#### entities_groups mapping

The intention of entities_groups map individual users to the groups they belong to for read operations. The most important thing this information is used for is showing the user which Ize groups they are a member of. These groups could be defined on other tools (e.g. Discord group, nft, Telegram group) or be an Ize group.

The reason it is entities_groups rather than users_groups is so that a user would be add/remove identities and associated groups should also be updated accordingly.

Entities groups is only updated in the following situations

- A user logs in
- A user adds an identity
- A telegram identity's membership with a telegram group is checked
- A new custom group is created

The logic for how Telegram entities_groups are updated is different than other identity tyeps because Telegram doesn't have a way of getting all of a telegram user's chat groups.
