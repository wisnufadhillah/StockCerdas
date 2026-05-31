type ReportProduct = {
  sku?: string | null;
  name?: string | null;
  category?: string | null;
  current_stock?: number | string | null;
  minimum_stock?: number | string | null;
  price?: number | string | null;
};

type ReportTransaction = {
  transaction_date?: string | null;
  product_name?: string | null;
  transaction_type?: string | null;
  quantity?: number | string | null;
  note?: string | null;
};

export function buildReportCsv({ products, transactions, generatedAt = new Date() }: { products: ReportProduct[]; transactions: ReportTransaction[]; generatedAt?: Date }) {
  const rows = [
    ["StockCerdas Useradmin Report"],
    ["Generated At", generatedAt.toISOString()],
    [],
    ["Product Summary"],
    ["SKU", "Product", "Category", "Current Stock", "Minimum Stock", "Price"],
    ...products.map((product) => [
      product.sku || "-",
      product.name || "-",
      product.category || "-",
      product.current_stock ?? 0,
      product.minimum_stock ?? 0,
      product.price ?? 0,
    ]),
    [],
    ["Transaction Summary"],
    ["Date", "Product", "Type", "Quantity", "Note"],
    ...transactions.map((transaction) => [
      transaction.transaction_date || "-",
      transaction.product_name || "-",
      transaction.transaction_type || "-",
      transaction.quantity ?? 0,
      transaction.note || "-",
    ]),
  ];

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
}

export function downloadReportCsv({ products, transactions }: { products: ReportProduct[]; transactions: ReportTransaction[] }) {
  const csv = buildReportCsv({ products, transactions });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `stockcerdas-laporan-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatCsvCell(value: unknown) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}
