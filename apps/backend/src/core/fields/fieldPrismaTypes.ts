import { Prisma } from "@prisma/client";

import { valueBaseInclude, valueInclude } from "../value/valuePrismaTypes";

export const fieldOptionInclude = Prisma.validator<Prisma.FieldOptionInclude>()({
  Value: {
    include: valueBaseInclude, // value base excludes option type
  },
});

export type FieldOptionPrismaType = Prisma.FieldOptionGetPayload<{
  include: typeof fieldOptionInclude;
}>;

export const fieldOptionSetInclude = Prisma.validator<Prisma.FieldOptionSetInclude>()({
  FieldOptions: {
    include: {
      Value: {
        include: valueBaseInclude, // value base excludes option type
      },
    },
    orderBy: {
      index: "asc",
    },
  },
});

export type FieldOptionSetPrismaType = Prisma.FieldOptionSetGetPayload<{
  include: typeof fieldOptionSetInclude;
}>;

export const fieldOptionsConfigInclude = Prisma.validator<Prisma.FieldOptionsConfigInclude>()({
  PredefinedOptionSet: {
    include: fieldOptionSetInclude,
  },
  FieldOptionsConfigLinkedResults: true,
});

export type FieldOptionsConfigPrismaType = Prisma.FieldOptionsConfigGetPayload<{
  include: typeof fieldOptionsConfigInclude;
}>;

export const fieldInclude = Prisma.validator<Prisma.FieldInclude>()({
  FieldOptionsConfig: {
    include: fieldOptionsConfigInclude,
  },
});

export type FieldPrismaType = Prisma.FieldGetPayload<{
  include: typeof fieldInclude;
}>;

export const fieldSetInclude = Prisma.validator<Prisma.FieldSetInclude>()({
  Fields: {
    include: fieldInclude,
    orderBy: {
      index: "asc",
    },
  },
});

export type FieldSetPrismaType = Prisma.FieldSetGetPayload<{
  include: typeof fieldSetInclude;
}>;

export const fieldAnswerInclude = Prisma.validator<Prisma.FieldAnswerInclude>()({
  Value: {
    include: valueInclude,
  },
});

export type FieldAnswerPrismaType = Prisma.FieldAnswerGetPayload<{
  include: typeof fieldAnswerInclude;
}>;
