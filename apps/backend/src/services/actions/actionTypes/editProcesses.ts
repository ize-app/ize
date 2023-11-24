import { prisma } from "../../../prisma/client";

const editProcesses = async ({
  processVersions,
}: {
  processVersions: string;
}) => {
  try {
    const processVersionArray = JSON.parse(processVersions);
    await prisma.$transaction(async (transaction) => {
      // update current process version of main process
      // set process version accepted to true

      await Promise.all(
        processVersionArray.map(async (processVersionId: string) => {
          const updatedVersion = await transaction.processVersion.update({
            data: {
              approved: true,
            },
            where: {
              id: processVersionId,
            },
          });

          await transaction.process.update({
            data: {
              currentProcessVersionId: processVersionId,
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
