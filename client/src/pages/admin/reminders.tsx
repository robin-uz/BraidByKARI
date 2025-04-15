import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BellRing, Calendar, Clock, CheckCircle2, AlertCircle, Mail, Send } from "lucide-react";
import { format, addDays } from "date-fns";

export default function RemindersAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [remindersSent, setRemindersSent] = useState<number | null>(null);
  const [scheduleType, setScheduleType] = useState<string>("daily");

  // Function to trigger sending reminders
  const handleSendReminders = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/reminders/send");
      const data = await response.json();
      
      setRemindersSent(data.remindersSent);
      toast({
        title: "Reminders processed",
        description: `${data.remindersSent} reminder${data.remindersSent !== 1 ? 's' : ''} sent successfully.`,
      });
    } catch (error) {
      console.error("Error sending reminders:", error);
      toast({
        title: "Error",
        description: "Failed to send appointment reminders.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to schedule reminder checks
  const handleScheduleReminders = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/reminders/schedule");
      const data = await response.json();
      
      toast({
        title: "Reminder Check Scheduled",
        description: "The system will automatically send reminders for upcoming appointments.",
      });
    } catch (error) {
      console.error("Error scheduling reminders:", error);
      toast({
        title: "Error",
        description: "Failed to schedule reminder checks.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate preview dates based on the selected schedule type
  const getPreviewDates = () => {
    const today = new Date();
    
    switch (scheduleType) {
      case "daily":
        return Array.from({ length: 5 }, (_, i) => addDays(today, i));
      case "twodays":
        return Array.from({ length: 3 }, (_, i) => addDays(today, i * 2));
      case "weekly":
        return Array.from({ length: 4 }, (_, i) => addDays(today, i * 7));
      default:
        return [today];
    }
  };

  return (
    <>
      <Helmet>
        <title>Appointment Reminders | Divine Braids</title>
      </Helmet>
      
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Appointment Reminders</h1>
            <p className="text-muted-foreground">Send automated reminders to clients about upcoming appointments</p>
          </div>
        </div>
        
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="send">Send Reminders</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Send Appointment Reminders</CardTitle>
                  <CardDescription>
                    Manually send reminders to clients with upcoming appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      This will send reminder emails to all clients with confirmed appointments scheduled for tomorrow.
                      Clients will receive a personalized email with their appointment details.
                    </p>
                    
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Important Note</h4>
                          <p className="text-sm text-muted-foreground">
                            Make sure your email credentials are configured correctly. Reminders will be sent from your salon's email address.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleSendReminders}
                      disabled={isLoading}
                      className="mt-2"
                    >
                      {isLoading ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminders Now
                        </>
                      )}
                    </Button>
                    
                    {remindersSent !== null && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-4">
                        <div className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Reminders Sent</h4>
                            <p className="text-sm">
                              Successfully sent {remindersSent} reminder{remindersSent !== 1 ? 's' : ''} to clients with upcoming appointments.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Status</CardTitle>
                  <CardDescription>Current reminder system status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Service</span>
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Run</span>
                      <span className="text-muted-foreground text-sm">
                        {format(new Date(), "MMM dd, yyyy - HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Today's Reminders</span>
                      <span className="text-muted-foreground text-sm">
                        {remindersSent ?? 0} sent
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="mr-2 h-3 w-3" />
                          Test Email
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <BellRing className="mr-2 h-3 w-3" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Automated Reminders</CardTitle>
                <CardDescription>
                  Configure when appointment reminders should be automatically sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Reminder Frequency</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Schedule Type</label>
                          <Select
                            value={scheduleType}
                            onValueChange={setScheduleType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily (Recommended)</SelectItem>
                              <SelectItem value="twodays">Every Two Days</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reminder Time</label>
                          <Select defaultValue="10">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="8">8:00 AM</SelectItem>
                              <SelectItem value="10">10:00 AM</SelectItem>
                              <SelectItem value="12">12:00 PM</SelectItem>
                              <SelectItem value="14">2:00 PM</SelectItem>
                              <SelectItem value="16">4:00 PM</SelectItem>
                              <SelectItem value="18">6:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button 
                          onClick={handleScheduleReminders}
                          disabled={isLoading}
                          className="mt-4 w-full"
                        >
                          {isLoading ? (
                            <>Setting up schedule...</>
                          ) : (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Save Schedule
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Preview Schedule</h3>
                      <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            With the current settings, reminders will run on the following dates:
                          </p>
                          <ul className="space-y-2">
                            {getPreviewDates().map((date, i) => (
                              <li key={i} className="flex items-center text-sm">
                                <Calendar className="mr-2 h-4 w-4 text-primary" />
                                <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-muted-foreground mt-4">
                            Clients with appointments on the day after each date will receive reminder emails.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Settings</CardTitle>
                <CardDescription>
                  Customize email templates and notification settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <h3 className="text-lg font-medium">Email Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">From Name</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            defaultValue="Divine Braids"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Reply-To Email</label>
                          <input
                            type="email"
                            className="w-full p-2 border rounded-md"
                            defaultValue="contact@divinebraids.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Subject</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          defaultValue="Reminder: Your Appointment Tomorrow at Divine Braids"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Template</label>
                        <textarea
                          className="w-full p-2 border rounded-md min-h-[200px]"
                          defaultValue={`<h2>Your Appointment Reminder</h2>
<p>Dear {{client_name}},</p>
<p>This is a friendly reminder of your upcoming appointment:</p>
<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
  <p><strong>Service:</strong> {{service_type}}</p>
  <p><strong>Date:</strong> {{appointment_date}}</p>
  <p><strong>Time:</strong> {{appointment_time}}</p>
</div>
<p>We're looking forward to seeing you!</p>
<p>If you need to reschedule, please contact us as soon as possible.</p>
<p>Best regards,</p>
<p>Divine Braids Team</p>`}
                        />
                        <p className="text-xs text-muted-foreground">
                          You can use these placeholders: {{client_name}}, {{service_type}}, 
                          {{appointment_date}}, {{appointment_time}}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}