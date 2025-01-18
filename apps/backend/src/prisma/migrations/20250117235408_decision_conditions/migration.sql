-- CreateTable
CREATE TABLE "decision_conditions" (
    "id" UUID NOT NULL,
    "result_config_decision_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "threshold" INTEGER NOT NULL,

    CONSTRAINT "decision_conditions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "decision_conditions" ADD CONSTRAINT "decision_conditions_result_config_decision_id_fkey" FOREIGN KEY ("result_config_decision_id") REFERENCES "result_config_decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_conditions" ADD CONSTRAINT "decision_conditions_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "field_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
