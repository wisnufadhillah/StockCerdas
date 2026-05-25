import { DashboardShell, type SuperAdminView } from "@/dashboard/dashboard-shell";

const allowedViews: SuperAdminView[] = ["pengguna", "monitoring", "pengaturan"];

export default async function SuperAdminFeaturePage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  const safeView = allowedViews.includes(view as SuperAdminView)
    ? (view as SuperAdminView)
    : "dashboard";

  return <DashboardShell role="superadmin" view={safeView} />;
}
