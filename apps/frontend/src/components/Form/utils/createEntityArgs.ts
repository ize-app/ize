import { Entity, EntityArgs } from "@/graphql/generated/graphql";

export const createEntityArgs = (entity: Entity): EntityArgs => ({ id: entity.entityId });
