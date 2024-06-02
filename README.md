# Ize

## Concepts

### Identities and Groups

Users authenticate into Ize via Identities. Identities we currently support are:

- Email
- EVM address
- Discord account

Users can have multiple identities.

Individual identities or "groups" can have roles (e.g. request/respond) on a process. When a group has a role on aprocess, Ize checks whether one of a given user's identities is part of that group. The current group types we support are:

- Discord roles
- NFT collections (721/1155 - including ENS/Hats, etc)

## Running Ize

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

Create a .env file in /backend

```
DATABASE_URL="postgresql://<username>@localhost:5432/izedev"
```

Ask Tyler for a sample .env to fill in discord details (put in shared 1password).

### Running in dev

Runs in dev mode with hot module reloading on both the backend server and frontend Vite server. Note that frontend assets are served differently in dev than during production. In development, a Vite server serves static assets whereas in production, these assets are served by express server

Run the frontend

`cd apps/frontend && npm run dev`

Build the database and run the backend

`cd apps/backend && npx prisma db push && npm run start:dev`

Navigate to [localhost:5173](http://localhost:5173/)

### Testing production build locally

Build backend and frontend

`npm run build`

Start the express server

`cd apps/backend && node dist/express/server.js`

Navigate to [localhost:3000](http://localhost:3000/)

This method of running the production build serves assets from the express server. An alternate method of just testing the production build of the frontend is to run `npm run preview` in the frontend app and navigate to [localhost:5173](http://localhost:5173/)

## Building a fullstack feature:

Make DB updates...
Update the `apps/backend/src/prisma/schema.prisma` with whatever schema updates you want.
Right now we are _not_ using migrations because there is no production data that needs to be maintained. So to update the schema in the database just run `npx prisma db push`

This will automatically update the prisma client and the associated types

Add a query resolver. There are already a few resolver files. If the new query/mutation belongs in there, make a new function and add it to the exports.

Implement whatever method for the resolver. You'll see examples of using prisma to make db updates or using the discord Api to fetch certain records

After you've written your resolver, add an associated graphql file in backend that defines the types that correspond to your resolver.

I.e. `apps/backend/src/graphql/group.graphql` : `apps/backend/src/graphql/resolvers/group_resolvers.ts`

Next make a _frontend_ graphql file that will define your query. I.e `apps/frontend/src/graphql/group.graphql`

Next run this command from the _frontend_ directory: `npm run codegen`. This will generate all response types, query documents and input types for you.

From there it's just react!

eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint eslint prettier @typescript-eslint/parser  @typescript-eslint/eslint-plugin @typescript-eslint/parser
