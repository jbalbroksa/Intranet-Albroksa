import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Sun, Moon, Monitor } from "lucide-react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState(16);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSaveSettings = () => {
    // In a real implementation, this would save to the database and apply the settings
    setMessage({
      text: "Appearance settings saved successfully",
      type: "success",
    });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="theme-light"
                className="sr-only"
              />
              <Label
                htmlFor="theme-light"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "light" ? "border-primary" : ""}`}
              >
                <Sun className="mb-3 h-6 w-6" />
                <span className="block w-full text-center">Light</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="dark"
                id="theme-dark"
                className="sr-only"
              />
              <Label
                htmlFor="theme-dark"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "dark" ? "border-primary" : ""}`}
              >
                <Moon className="mb-3 h-6 w-6" />
                <span className="block w-full text-center">Dark</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="system"
                id="theme-system"
                className="sr-only"
              />
              <Label
                htmlFor="theme-system"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${theme === "system" ? "border-primary" : ""}`}
              >
                <Monitor className="mb-3 h-6 w-6" />
                <span className="block w-full text-center">System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Font Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Small</span>
              <span className="text-sm">{fontSize}px</span>
              <span className="text-sm">Large</span>
            </div>
            <Slider
              value={[fontSize]}
              min={12}
              max={20}
              step={1}
              onValueChange={(value) => setFontSize(value[0])}
            />
            <div className="pt-4">
              <p
                style={{ fontSize: `${fontSize}px` }}
                className="border p-4 rounded-md"
              >
                This is a preview of the selected font size.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reducedMotion"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="reducedMotion">Reduce motion</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Minimize animations and transitions throughout the interface.
            </p>
          </div>

          <Separator className="my-6" />

          {message.text && (
            <div
              className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
