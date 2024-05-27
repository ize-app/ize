import { createContext, useState } from "react";

import { EntitySummaryPartsFragment } from "../graphql/generated/graphql";
import { dedupEntities } from "../utils/dedupEntities";

interface RecentAgentsContextValue {
  recentAgents: EntitySummaryPartsFragment[];
  setRecentAgents: (agents: EntitySummaryPartsFragment[]) => void;
}

export const RecentAgentsContext = createContext<RecentAgentsContextValue>({
  recentAgents: [],
  setRecentAgents: () => {
    return;
  },
});

export const RecentAgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentAgents, set] = useState<EntitySummaryPartsFragment[]>([]);

  // limit results
  // TODO: Dedup results
  const setRecentAgents = (agents: EntitySummaryPartsFragment[]) => {
    set((prev) => {
      const newAgents = dedupEntities([...prev, ...agents]);
      return newAgents.slice(-20);
    });
  };

  return (
    <RecentAgentsContext.Provider value={{ recentAgents, setRecentAgents }}>
      {children}
    </RecentAgentsContext.Provider>
  );
};
