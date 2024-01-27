import { createContext, useState } from "react";

import { AgentSummaryPartsFragment } from "../graphql/generated/graphql";

interface RecentAgentsContextValue {
  recentAgents: AgentSummaryPartsFragment[];
  setRecentAgents: (agents: AgentSummaryPartsFragment[]) => void;
}

export const RecentAgentsContext = createContext<RecentAgentsContextValue>({
  recentAgents: [],
  setRecentAgents: () => {
    return;
  },
});

export const dedupOptions = (agents: AgentSummaryPartsFragment[]) => {
  const uniqueIds: { [key: string]: boolean } = {};
  return agents.filter((agent: AgentSummaryPartsFragment) => {
    if (!uniqueIds[agent.id]) {
      uniqueIds[agent.id] = true;
      return true;
    }
    return false;
  });
};

export const RecentAgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentAgents, set] = useState<AgentSummaryPartsFragment[]>([]);

  // limit results
  // TODO: Dedup results
  const setRecentAgents = (agents: AgentSummaryPartsFragment[]) => {
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
