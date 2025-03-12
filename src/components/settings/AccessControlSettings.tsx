import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, UserCheck } from "lucide-react";

interface RolePermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export default function AccessControlSettings() {
  const [userRole, setUserRole] = useState("franchise_manager");
  const [message, setMessage] = useState({ text: "", type: "" });

  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    {
      id: "documents",
      name: "Documents",
      description: "Access to document repository",
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: "content",
      name: "Content",
      description: "Access to content management",
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: "forums",
      name: "Forums",
      description: "Access to discussion forums",
      permissions: {
        view: true,
        create: true,
        edit: true,
        delete: false,
      },
    },
    {
      id: "training",
      name: "Training",
      description: "Access to training materials",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
    {
      id: "users",
      name: "Users",
      description: "Access to user management",
      permissions: {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  ]);

  const handleTogglePermission = (
    moduleId: string,
    permission: keyof RolePermission["permissions"],
  ) => {
    setRolePermissions(
      rolePermissions.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              permissions: {
                ...module.permissions,
                [permission]: !module.permissions[permission],
              },
            }
          : module,
      ),
    );
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to the database
    setMessage({
      text: "Access control settings saved successfully",
      type: "success",
    });

    // Clear message after 3 seconds
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={userRole}
            onValueChange={setUserRole}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="admin" id="role-admin" />
              <div className="grid gap-1.5">
                <Label htmlFor="role-admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Administrator
                  <Badge className="ml-2">Full Access</Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Full access to all system features and settings
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem
                value="franchise_manager"
                id="role-franchise-manager"
              />
              <div className="grid gap-1.5">
                <Label
                  htmlFor="role-franchise-manager"
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4 text-primary" />
                  Franchise Manager
                </Label>
                <p className="text-sm text-muted-foreground">
                  Manage franchise content, documents, and team members
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="employee" id="role-employee" />
              <div className="grid gap-1.5">
                <Label
                  htmlFor="role-employee"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-primary" />
                  Employee
                  <Badge variant="outline" className="ml-2">
                    Limited Access
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Basic access to view content and participate in forums
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Configure permissions for the {userRole.replace("_", " ")} role
            </p>

            <div className="border rounded-md">
              <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                <div>Module</div>
                <div className="text-center">View</div>
                <div className="text-center">Create</div>
                <div className="text-center">Edit</div>
                <div className="text-center">Delete</div>
              </div>

              {rolePermissions.map((module) => (
                <div
                  key={module.id}
                  className="grid grid-cols-5 gap-4 p-4 border-b last:border-0 items-center"
                >
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={module.permissions.view}
                      onCheckedChange={() =>
                        handleTogglePermission(module.id, "view")
                      }
                      disabled={userRole === "admin"}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={module.permissions.create}
                      onCheckedChange={() =>
                        handleTogglePermission(module.id, "create")
                      }
                      disabled={userRole === "admin"}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={module.permissions.edit}
                      onCheckedChange={() =>
                        handleTogglePermission(module.id, "edit")
                      }
                      disabled={userRole === "admin"}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={module.permissions.delete}
                      onCheckedChange={() =>
                        handleTogglePermission(module.id, "delete")
                      }
                      disabled={userRole === "admin"}
                    />
                  </div>
                </div>
              ))}
            </div>

            {userRole === "admin" && (
              <p className="text-sm text-muted-foreground italic">
                Administrator role has full access to all features by default
              </p>
            )}
          </div>

          <Separator className="my-6" />

          {message.text && (
            <div
              className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <Button onClick={handleSaveSettings}>Save Permissions</Button>
        </CardContent>
      </Card>
    </div>
  );
}
