import { useState } from "react";
import { usePanels } from "@/hooks/use-panels";
import { Plus, Trash2, Layers, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPanelSchema, type InsertPanel } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

export default function Panels() {
  const { panels, isLoading, createPanel, deletePanel } = usePanels();
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<InsertPanel>({
    resolver: zodResolver(insertPanelSchema),
    defaultValues: {
      title: "",
      description: "",
      emoji: "🎫",
      buttonLabel: "Open Ticket",
      supportTeamRole: "",
      createdMessage: "Thanks for opening a ticket! Support will be with you shortly.",
    },
  });

  const onSubmit = (data: InsertPanel) => {
    createPanel.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      },
    });
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading panels...</div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Panels</h1>
          <p className="text-muted-foreground mt-1">Manage categories users can select to open tickets.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <Plus className="w-4 h-4" /> Create Panel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-foreground">
            <DialogHeader>
              <DialogTitle>Create New Panel</DialogTitle>
              <DialogDescription>
                Add a new ticket category for your Discord server.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. General Support" className="bg-secondary border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Explain what this ticket is for..." className="bg-secondary border-white/10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emoji"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emoji</FormLabel>
                        <FormControl>
                          <Input placeholder="🎫" className="bg-secondary border-white/10" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="buttonLabel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Open Ticket" className="bg-secondary border-white/10" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="supportTeamRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Role ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Role ID to ping (optional)" className="bg-secondary border-white/10 font-mono text-xs" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full mt-4" 
                  disabled={createPanel.isPending}
                >
                  {createPanel.isPending ? "Creating..." : "Create Panel"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Panels Yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Create your first ticket panel to allow users to open tickets in your server.
            </p>
            <Button variant="outline" onClick={() => setIsOpen(true)}>
              Create First Panel
            </Button>
          </div>
        ) : (
          panels.map((panel) => (
            <div key={panel.id} className="glass-panel p-6 rounded-2xl group relative hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{panel.emoji || "🎫"}</span>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this panel?")) {
                      deletePanel.mutate(panel.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-bold mb-2">{panel.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                {panel.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-2 rounded border border-white/5">
                <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-white/5">
                  ID: {panel.id}
                </span>
                {panel.supportTeamRole && (
                  <span className="font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 truncate max-w-[120px]">
                    @{panel.supportTeamRole}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
