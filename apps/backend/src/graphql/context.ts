import { User } from "@prisma/client"

export type GraphqlRequestContext = {
  currentUser: User | null
}
