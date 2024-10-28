import { createContext, useState } from "react";

import { EntityFragment } from "../../graphql/generated/graphql";
import { dedupEntities } from "../../utils/dedupEntities";

interface RecentAgentsContextValue {
  recentAgents: EntityFragment[];
  setRecentAgents: (agents: EntityFragment[]) => void;
}

export const RecentAgentsContext = createContext<RecentAgentsContextValue>({
  recentAgents: [],
  setRecentAgents: () => {
    return;
  },
});

export const RecentAgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentAgents, set] = useState<EntityFragment[]>([]);

  // limit results
  // TODO: Dedup results
  const setRecentAgents = (agents: EntityFragment[]) => {
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
