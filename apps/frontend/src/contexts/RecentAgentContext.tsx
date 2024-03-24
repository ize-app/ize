import { createContext, useState } from "react";

import { EntitySummaryPartsFragment } from "../graphql/generated/graphql";

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

export const dedupOptions = (agents: EntitySummaryPartsFragment[]) => {
  const uniqueIds: { [key: string]: boolean } = {};
  return agents.filter((agent: EntitySummaryPartsFragment) => {
    if (!uniqueIds[agent.id]) {
      uniqueIds[agent.id] = true;
      return true;
    }
    return false;
  });
};

export const RecentAgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentAgents, set] = useState<EntitySummaryPartsFragment[]>([]);

  // limit results
  // TODO: Dedup results
  const setRecentAgents = (agents: EntitySummaryPartsFragment[]) => {
    set((prev) => {
      const newAgents = dedupOptions([...prev, ...agents]);
      return newAgents.slice(-20);
    });
  };

  return (
    <RecentAgentsContext.Provider value={{ recentAgents, setRecentAgents }}>
      {children}
    </RecentAgentsContext.Provider>
  );
};
