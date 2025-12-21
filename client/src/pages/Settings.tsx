import { useSettings } from "@/hooks/use-settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSettingsSchema, type InsertSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Save, Bot, Hash, Users, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Settings() {
  const { settings, isLoading, updateSettings } = useSettings();

  const form = useForm<InsertSettings>({
    resolver: zodResolver(insertSettingsSchema),
    defaultValues: {
      guildId: "",
      transcriptChannelId: "",
      categoryOpenId: "",
      categoryClosedId: "",
      welcomeMessage: "Please be patient, staff will help you soon.",
      staffRoles: [],
    },
  });

  // Load existing settings into form
  useEffect(() => {
    if (settings) {
      form.reset({
        guildId: settings.guildId,
        transcriptChannelId: settings.transcriptChannelId || "",
        categoryOpenId: settings.categoryOpenId || "",
        categoryClosedId: settings.categoryClosedId || "",
        welcomeMessage: settings.welcomeMessage || "",
        staffRoles: settings.staffRoles || [],
      });
    }
  }, [settings, form]);

  const onSubmit = (data: InsertSettings) => {
    // Ensure staffRoles is an array of strings
    const formattedData = {
      ...data,
      staffRoles: Array.isArray(data.staffRoles) ? data.staffRoles : []
    };
    updateSettings.mutate(formattedData);
  };

  if (isLoading) return <div className="p-8 animate-pulse text-muted-foreground">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bot Configuration</h1>
        <p className="text-muted-foreground mt-1">Configure how the ticket bot interacts with your Discord server.</p>
      </div>

      <Alert className="bg-primary/5 border-primary/20 text-primary-foreground">
        <Bot className="h-4 w-4" />
        <AlertTitle>Developer Mode Required</AlertTitle>
        <AlertDescription>
          You need Discord Developer Mode enabled to copy IDs. Go to User Settings {'>'} Advanced {'>'} Developer Mode.
        </AlertDescription>
      </Alert>

      <div className="glass-panel p-8 rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* General Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-white/5 pb-2">
                <Bot className="w-5 h-5 text-primary" /> General Settings
              </h3>
              
              <FormField
                control={form.control}
                name="guildId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Server (Guild) ID</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012345678" className="bg-background/50 border-white/10 font-mono" {...field} />
                    </FormControl>
                    <FormDescription>Right-click server icon {'>'} Copy ID</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Message sent when ticket opens..." 
                        className="bg-background/50 border-white/10 min-h-[100px]" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Channels Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-white/5 pb-2">
                <Hash className="w-5 h-5 text-primary" /> Channels & Categories
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoryOpenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Open Tickets Category ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Category ID" className="bg-background/50 border-white/10 font-mono" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryClosedId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Closed Tickets Category ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Category ID (Optional)" className="bg-background/50 border-white/10 font-mono" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="transcriptChannelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transcript Channel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Channel ID for logs" className="bg-background/50 border-white/10 font-mono" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>Where closed ticket transcripts will be sent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Roles Section (Simplified as text input for now, ideally multi-select) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-white/5 pb-2">
                <Users className="w-5 h-5 text-primary" /> Permissions
              </h3>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200 flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Note: For the "Staff Roles" field, this UI currently expects you to handle role management via the bot directly or implementing a complex role selector. For this demo, functionality is limited.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                className="gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? "Saving..." : <><Save className="w-4 h-4" /> Save Configuration</>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
