import { Prisma } from "@prisma/client";

export const fieldInclude = Prisma.validator<Prisma.FieldInclude>()({
  FieldOptionsConfigs: {
    include: {
      FieldOptionSet: {
        include: {
          FieldOptionSetFieldOptions: {
            include: {
              FieldOption: true
            }
          }
        }
      }
    }
  },
});

export type FieldPrismaType = Prisma.FieldGetPayload<{
  include: typeof fieldInclude;
}>;