import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPanel, type Panel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePanels() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const panelsQuery = useQuery({
    queryKey: [api.panels.list.path],
    queryFn: async () => {
      const res = await fetch(api.panels.list.path);
      if (!res.ok) throw new Error("Failed to fetch panels");
      return api.panels.list.responses[200].parse(await res.json());
    },
  });

  const createPanel = useMutation({
    mutationFn: async (data: InsertPanel) => {
      const res = await fetch(api.panels.create.path, {
        method: api.panels.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create panel");
      }
      return api.panels.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.panels.list.path] });
      toast({ title: "Success", description: "Ticket panel created successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePanel = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.panels.delete.path, { id });
      const res = await fetch(url, { method: api.panels.delete.method });
      if (!res.ok) throw new Error("Failed to delete panel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.panels.list.path] });
      toast({ title: "Deleted", description: "Panel removed successfully." });
    },
  });

  return {
    panels: panelsQuery.data || [],
    isLoading: panelsQuery.isLoading,
    createPanel,
    deletePanel,
  };
}
