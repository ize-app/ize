import { prisma } from "../../../prisma/client";

const editProcesses = async ({
  processVersions,
}: {
  processVersions: string;
}) => {
  try {
    type ProcessIdChanges = [oldId: string, newId: string];
    const processVersionArray: ProcessIdChanges[] = JSON.parse(processVersions);
    await prisma.$transaction(async (transaction) => {
      // update current process version of main process
      // set process version accepted to true

      await Promise.all(
        processVersionArray.map(async (processVersionChange) => {
          const updatedVersion = await transaction.processVersion.update({
            data: {
              approved: true,
            },
            where: {
              id: processVersionChange[1],
            },
          });

          await transaction.process.update({
            data: {
              currentProcessVersionId: processVersionChange[1],
            },
            where: {
              id: updatedVersion.processId,
            },
          });
        }),
      );
    });
    return true;
  } catch (e) {
    console.log("Edit process action error: ", e);
    return false;
  }
};

export default editProcesses;
