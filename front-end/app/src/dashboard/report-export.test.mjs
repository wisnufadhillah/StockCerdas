import assert from "node:assert/strict";
import test from "node:test";

import { buildReportCsv } from "./report-export.ts";

test("buildReportCsv exports product and transaction summaries", () => {
  const csv = buildReportCsv({
    products: [
      { sku: "SKU-1", name: "Kopi, Susu", category: "Minuman", current_stock: 12, minimum_stock: 3, price: 15000 },
    ],
    transactions: [
      { transaction_date: "2026-05-31T10:00:00.000Z", product_name: "Kopi, Susu", transaction_type: "in", quantity: 4, note: "Restock pagi" },
    ],
    generatedAt: new Date("2026-05-31T12:00:00.000Z"),
  });

  assert.match(csv, /StockCerdas Useradmin Report/);
  assert.match(csv, /Generated At,2026-05-31T12:00:00.000Z/);
  assert.match(csv, /Product Summary/);
  assert.match(csv, /SKU-1,"Kopi, Susu",Minuman,12,3,15000/);
  assert.match(csv, /Transaction Summary/);
  assert.match(csv, /2026-05-31T10:00:00.000Z,"Kopi, Susu",in,4,Restock pagi/);
});

test("buildReportCsv still exports headers when data is empty", () => {
  const csv = buildReportCsv({ products: [], transactions: [], generatedAt: new Date("2026-05-31T12:00:00.000Z") });

  assert.match(csv, /SKU,Product,Category,Current Stock,Minimum Stock,Price/);
  assert.match(csv, /Date,Product,Type,Quantity,Note/);
});
