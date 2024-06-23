// import {
//   FieldFragment,
//   RequestFragment,
//   ResultConfigFragment,
//   ResultFragment,
// } from "@/graphql/generated/graphql";

// interface HydratedResultData {
//   field: FieldFragment;
//   resultConfig: ResultConfigFragment;
//   result: ResultFragment | null;
// }

// // lists all results from a given request
// const Results = ({ request }: { request: RequestFragment }) => {
//   // create array of all result configs mapped to their fields and respective results
//   const hydratedResults: HydratedResultData[] = [];

//   request.flow.steps.forEach((step) => {
//     step.result.forEach((resultConfig) => {
//       const field = step.response.fields.find((field) => field.fieldId === resultConfig.fieldId);
//       const result = request.steps[0].results.find(
//         (result) => result.resultConfigId === resultConfig.resultConfigId,
//       );
//       console.log(field, result);
//       hydratedResults.push({ field, resultConfig, result });
//     });
//   });
//   //  map through all result configs and return a Result component for each
// };
