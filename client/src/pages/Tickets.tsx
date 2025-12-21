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
import { Search, Filter, MessageSquare, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function Tickets() {
  const { tickets, isLoading } = useTickets();

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading tickets...</div>;

  return (
    <div className="space-y-6 animate-in">
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
          <button className="p-2.5 bg-card border border-white/10 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">Ticket ID</TableHead>
              <TableHead className="text-gray-400 font-medium">Creator</TableHead>
              <TableHead className="text-gray-400 font-medium">Channel</TableHead>
              <TableHead className="text-gray-400 font-medium">Status</TableHead>
              <TableHead className="text-gray-400 font-medium">Created</TableHead>
              <TableHead className="text-right text-gray-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="w-8 h-8 opacity-20" />
                    <p>No tickets found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="font-mono text-xs">#{ticket.id}</TableCell>
                  <TableCell className="font-medium">
                    <span className="font-mono text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {ticket.creatorId}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.channelId}</TableCell>
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
