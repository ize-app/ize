import { Prisma } from "@prisma/client";

export const fieldOptionSetInclude = Prisma.validator<Prisma.FieldOptionSetInclude>()({
  FieldOptionSetFieldOptions: {
    include: {
      FieldOption: true,
    },
  },
});

export type FieldOptionSetPrismaType = Prisma.FieldOptionSetGetPayload<{
  include: typeof fieldOptionSetInclude;
}>;

export const fieldInclude = Prisma.validator<Prisma.FieldInclude>()({
  FieldOptionsConfigs: {
    include: {
      FieldOptionSet: {
        include: fieldOptionSetInclude,
      },
    },
  },
});

export type FieldPrismaType = Prisma.FieldGetPayload<{
  include: typeof fieldInclude;
}>;

export const fieldSetInclude = Prisma.validator<Prisma.FieldSetInclude>()({
  FieldSetFields: {
    include: {
      Field: {
        include: fieldInclude,
      },
    },
  },
});

export type FieldSetPrismaType = Prisma.FieldSetGetPayload<{
  include: typeof fieldSetInclude;
}>;

export const fieldAnswerInclude = Prisma.validator<Prisma.FieldAnswerInclude>()({
  AnswerFreeInput: true,
  AnswerOptionSelections: true,
});

export type FieldAnswerPrismaType = Prisma.FieldAnswerGetPayload<{
  include: typeof fieldAnswerInclude;
}>;
