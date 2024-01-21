# Cults

## Concepts

### Identities and Groups

Users authenticate into Cults via Identities. Identities we currently support are:

- Email
- EVM address
- Discord account

Users can have multiple identities.

Individual identities or "groups" can have roles (e.g. request/respond) on a process. When a group has a role on aprocess, Cults checks whether one of a given user's identities is part of that group. The current group types we support are:

- Discord roles
- NFT collections (721/1155 - including ENS/Hats, etc)

## Running Cults for the first time

Install Homebrew

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Install Postgres

`brew install postgresql`

Run Postgres

`brew services start postgresql`

Install nvm

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`

Install packages

`npm i`

Create a .env file in /backend

Add a DB URL to /backend/.env (may actually be able to do `prisma init`)

```
DATABASE_URL="postgresql://<username>@localhost:5432/cults_development"
```

Ask David Or Tyler for Sample .env to fill in discord details (put in shared 1password).

Run the frontend

`cd apps/frontend && npm run dev`

Build the database and run the backend

`cd apps/backend && npx prisma db push && npm run start:dev`

## Deleting Groups or Processes

The easiest way to delete groups and processes is to use your Postgresql GUI and delete the records manually. All the associated records will be deleted due to `CASCADE DELETE` foreign keys

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
