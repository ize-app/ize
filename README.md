# cults

install homebrew

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

install postgres

`brew install postgresql`

Run postgres

`brew services start postgresql`

install nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

create a backend .env file

Add a DB URL to your backend .env (may actually be able to do `prisma init`)

```
DATABASE_URL="postgresql://<username>@localhost:5432/cults_development"
```

Ask David Or Tyler for Sample .env to fill in discord details (put in shared 1password).

Run frontend

`cd apps/frontend && npm run dev`

Run backend

`cd apps/backend && npm run start:dev`
