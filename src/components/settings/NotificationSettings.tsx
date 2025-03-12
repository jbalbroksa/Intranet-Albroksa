import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "news",
      title: "News and Announcements",
      description: "Receive notifications for company news and announcements",
      enabled: true,
    },
    {
      id: "documents",
      title: "Document Updates",
      description: "Get notified when documents are added or updated",
      enabled: true,
    },
    {
      id: "forum",
      title: "Forum Activity",
      description: "Notifications for replies to your forum posts",
      enabled: true,
    },
    {
      id: "mentions",
      title: "Mentions",
      description: "Notify when someone mentions you in comments or posts",
      enabled: true,
    },
    {
      id: "training",
      title: "Training Reminders",
      description: "Reminders about upcoming training sessions",
      enabled: false,
    },
    {
      id: "events",
      title: "Events",
      description: "Notifications about company events and meetings",
      enabled: true,
    },
  ]);

  const [emailSettings, setEmailSettings] = useState({
    dailyDigest: true,
    weeklyNewsletter: true,
    instantNotifications: false,
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleToggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting,
      ),
    );
  };

  const handleToggleEmailSetting = (key: keyof typeof emailSettings) => {
    setEmailSettings({
      ...emailSettings,
      [key]: !emailSettings[key],
    });
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to the database
    setMessage({
      text: "Notification preferences saved successfully",
      type: "success",
    });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <Label htmlFor={setting.id}>{setting.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => handleToggleSetting(setting.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dailyDigest">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary of all activities
                </p>
              </div>
              <Switch
                id="dailyDigest"
                checked={emailSettings.dailyDigest}
                onCheckedChange={() => handleToggleEmailSetting("dailyDigest")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weeklyNewsletter">Weekly Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly company updates and news
                </p>
              </div>
              <Switch
                id="weeklyNewsletter"
                checked={emailSettings.weeklyNewsletter}
                onCheckedChange={() =>
                  handleToggleEmailSetting("weeklyNewsletter")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="instantNotifications">
                  Instant Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications immediately
                </p>
              </div>
              <Switch
                id="instantNotifications"
                checked={emailSettings.instantNotifications}
                onCheckedChange={() =>
                  handleToggleEmailSetting("instantNotifications")
                }
              />
            </div>
          </div>

          <Separator className="my-6" />

          {message.text && (
            <div
              className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <Button onClick={handleSaveSettings}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
}
