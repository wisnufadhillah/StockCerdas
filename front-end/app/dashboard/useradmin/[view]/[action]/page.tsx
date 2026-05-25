import {
  DashboardShell,
  type DashboardAction,
  type UserAdminView,
} from "@/dashboard/dashboard-shell";

const allowedViews: UserAdminView[] = [
  "inventaris",
  "transaksi",
  "forecasting",
  "import-data",
  "laporan",
  "kategori",
  "pengaturan",
];
const allowedActions: DashboardAction[] = ["tambah", "detail", "edit", "hapus"];

export default async function UserAdminActionPage({
  params,
}: {
  params: Promise<{ view: string; action: string }>;
}) {
  const { view, action } = await params;
  const safeView = allowedViews.includes(view as UserAdminView) ? (view as UserAdminView) : "inventaris";
  const safeAction = allowedActions.includes(action as DashboardAction)
    ? (action as DashboardAction)
    : "detail";

  return <DashboardShell role="useradmin" view={safeView} action={safeAction} />;
}
