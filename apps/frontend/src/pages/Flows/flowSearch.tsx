import { FlowSummaryFragment } from "@/graphql/generated/graphql";

// const searchForUser = (regExSearchQuery: RegExp, users: AgentSummaryPartsFragment[]) => {
//     let foundMatch = false;
//     for (let i = 0; i < users.length; i++) {
//       if (users[i].name.search(regExSearchQuery) !== -1) {
//         foundMatch = true;
//         break;
//       }
//     }
//     return foundMatch;
//   };

export const filterFlows = ({
  flows,
  searchQuery,
}: {
  flows: FlowSummaryFragment[];
  searchQuery: string;
}) =>
  flows
    .filter((flow) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      let searchMatch = false;

      if (flow.name.search(regExSearchQuery) !== -1) searchMatch = true;
      // else if (searchForUser(regExSearchQuery, process.roles.request)) searchMatch = true;
      // else if (searchForUser(regExSearchQuery, process.roles.respond)) searchMatch = true;
      // else if (searchForUser(regExSearchQuery, [process.roles.edit]))
      //   searchMatch = true;

      return searchMatch;
    })
    .sort();
