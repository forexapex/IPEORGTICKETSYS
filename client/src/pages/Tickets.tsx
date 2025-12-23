import { useTickets } from "@/hooks/use-tickets";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MessageSquare, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const priorityConfig = {
  low: { label: "Low", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  urgent: { label: "Urgent", color: "bg-red-500/10 text-red-500 border-red-500/20" }
};

export default function Tickets() {
  const { tickets, isLoading } = useTickets();
  const [sortBy, setSortBy] = useState<"priority" | "created" | "status">("priority");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };

  const sortedTickets = useMemo(() => {
    let filtered = tickets;
    if (filterPriority !== "all") {
      filtered = tickets.filter(t => t.priority === filterPriority);
    }

    return filtered.sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      } else if (sortBy === "created") {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }
      return a.status.localeCompare(b.status);
    });
  }, [tickets, sortBy, filterPriority]);

  const handlePriorityChange = async (ticketId: number, newPriority: string) => {
    await apiRequest("PATCH", `/api/tickets/${ticketId}/priority`, { priority: newPriority });
    queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading tickets...</div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground mt-1">View and manage all support requests.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search tickets..." 
                className="pl-9 bg-card border-white/10"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-40 bg-card border-white/10">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Sort by Priority</SelectItem>
              <SelectItem value="created">Sort by Created</SelectItem>
              <SelectItem value="status">Sort by Status</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40 bg-card border-white/10">
              <SelectValue placeholder="Filter priority..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Ticket ID</TableHead>
              <TableHead className="text-gray-400 font-medium">Creator</TableHead>
              <TableHead className="text-gray-400 font-medium">Priority</TableHead>
              <TableHead className="text-gray-400 font-medium">Status</TableHead>
              <TableHead className="text-gray-400 font-medium">Created</TableHead>
              <TableHead className="text-right text-gray-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="w-8 h-8 opacity-20" />
                    <p>No tickets found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="font-mono text-xs">#{ticket.id}</TableCell>
                  <TableCell className="font-medium">
                    <span className="font-mono text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {ticket.creatorId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select value={ticket.priority} onValueChange={(v) => handlePriorityChange(ticket.id, v)}>
                      <SelectTrigger className="w-32 h-8 bg-transparent border-0 p-0" data-testid={`priority-select-${ticket.id}`}>
                        <Badge variant="outline" className={`${priorityConfig[ticket.priority as keyof typeof priorityConfig]?.color || ''}`}>
                          {priorityConfig[ticket.priority as keyof typeof priorityConfig]?.label || ticket.priority}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'} className={
                      ticket.status === 'open' ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 border-gray-500/20"
                    }>
                      {ticket.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
