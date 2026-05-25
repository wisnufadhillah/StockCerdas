import { DashboardShell, type UserAdminView } from "@/dashboard/dashboard-shell";

const allowedViews: UserAdminView[] = [
  "inventaris",
  "transaksi",
  "forecasting",
  "import-data",
  "laporan",
  "kategori",
  "pengaturan",
];

export default async function UserAdminFeaturePage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  const safeView = allowedViews.includes(view as UserAdminView) ? (view as UserAdminView) : "dashboard";

  return <DashboardShell role="useradmin" view={safeView} />;
}
