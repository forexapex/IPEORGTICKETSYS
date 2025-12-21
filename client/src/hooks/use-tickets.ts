import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useTickets() {
  const ticketsQuery = useQuery({
    queryKey: [api.tickets.list.path],
    queryFn: async () => {
      const res = await fetch(api.tickets.list.path);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return api.tickets.list.responses[200].parse(await res.json());
    },
  });

  const statsQuery = useQuery({
    queryKey: [api.tickets.stats.path],
    queryFn: async () => {
      const res = await fetch(api.tickets.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.tickets.stats.responses[200].parse(await res.json());
    },
  });

  return {
    tickets: ticketsQuery.data || [],
    stats: statsQuery.data || { total: 0, open: 0, closed: 0 },
    isLoading: ticketsQuery.isLoading || statsQuery.isLoading,
  };
}
