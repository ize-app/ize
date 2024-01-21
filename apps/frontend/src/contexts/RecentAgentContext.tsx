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

export const RecentAgentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentAgents, set] = useState<AgentSummaryPartsFragment[]>([]);

  // limit results
  // TODO: Dedup results
  const setRecentAgents = (agents: AgentSummaryPartsFragment[]) => {
    set((prev) => {
      return [...prev, ...agents].slice(-20);
    });
  };

  return (
    <RecentAgentsContext.Provider value={{ recentAgents, setRecentAgents }}>
      {children}
    </RecentAgentsContext.Provider>
  );
};
