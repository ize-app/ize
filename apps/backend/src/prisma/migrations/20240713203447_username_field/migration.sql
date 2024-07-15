ALTER TABLE "users" 
RENAME COLUMN "firstName" TO "name";

ALTER TABLE "users" 
DROP COLUMN "lastName";

ALTER TABLE "users" 
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '';
