import PermissionManager from "./PermissionManager";

export default function AccessControlSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestión de Permisos</h2>
      <p className="text-muted-foreground mb-6">
        Configure los permisos para roles y tipos de usuario en el sistema.
      </p>
      <PermissionManager />
    </div>
  );
}
