import {
  DashboardShell,
  type DashboardAction,
  type SuperAdminView,
} from "@/dashboard/dashboard-shell";

const allowedViews: SuperAdminView[] = ["pengguna", "monitoring", "pengaturan"];
const allowedActions: DashboardAction[] = ["tambah", "detail", "edit", "hapus"];

export default async function SuperAdminActionPage({
  params,
}: {
  params: Promise<{ view: string; action: string }>;
}) {
  const { view, action } = await params;
  const safeView = allowedViews.includes(view as SuperAdminView)
    ? (view as SuperAdminView)
    : "pengguna";
  const safeAction = allowedActions.includes(action as DashboardAction)
    ? (action as DashboardAction)
    : "detail";

  return <DashboardShell role="superadmin" view={safeView} action={safeAction} />;
}
