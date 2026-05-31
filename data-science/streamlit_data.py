from pathlib import Path

import pandas as pd


def build_sample_cleaned_data() -> pd.DataFrame:
    rows = [
        ["2024-01-15", "Sari", "Beras", 75000, "Transfer", "Tidak", "Ibu Rumah Tangga", "No Promotion"],
        ["2024-02-12", "Raka", "Susu", 18000, "Cash", "Ya", "Profesional", "Discount"],
        ["2024-03-09", "Dina", "Roti", 15000, "Debit", "Tidak", "Young Adult", "No Promotion"],
        ["2024-04-18", "Bimo", "Minyak Goreng", 42000, "Mobile Payment", "Ya", "Ibu Rumah Tangga", "BOGO"],
        ["2024-05-22", "Lina", "Telur", 32000, "Cash", "Tidak", "Profesional", "No Promotion"],
        ["2024-06-11", "Nanda", "Beras", 75000, "Transfer", "Tidak", "Ibu Rumah Tangga", "No Promotion"],
        ["2024-07-07", "Adi", "Susu", 18000, "Debit", "Ya", "Young Adult", "Discount"],
        ["2024-08-26", "Maya", "Kopi", 28000, "Mobile Payment", "Tidak", "Profesional", "No Promotion"],
    ]
    return pd.DataFrame(rows, columns=[
        "Datetime",
        "Customer_Name",
        "Product",
        "Estimated_Product_Price_IDR",
        "Payment_Method",
        "Discount_Applied",
        "Customer_Category",
        "Promotion",
    ])


def build_sample_feature_data() -> pd.DataFrame:
    rows = [
        ["2024-08-01", "Beras", 42, 38, 6, 24, 12, "Perlu Restock"],
        ["2024-08-01", "Susu", 36, 31, 5, 20, 28, "Aman"],
        ["2024-08-01", "Roti", 29, 27, 4, 17, 8, "Perlu Restock"],
        ["2024-08-01", "Minyak Goreng", 18, 20, 3, 13, 0, "Habis"],
        ["2024-08-01", "Telur", 22, 21, 4, 15, 18, "Aman"],
        ["2024-08-01", "Kopi", 16, 14, 2, 9, 11, "Aman"],
    ]
    return pd.DataFrame(rows, columns=[
        "YearMonth",
        "Product",
        "Qty_Sold",
        "Rolling_Mean_3",
        "Safety_Stock",
        "Reorder_Point",
        "Stok_Akhir",
        "Status_Stok",
    ])


def load_csv_or_sample(path: Path, dataset_type: str) -> pd.DataFrame:
    if path.exists():
        return pd.read_csv(path, sep=None, engine="python")
    if dataset_type == "cleaned":
        return build_sample_cleaned_data()
    if dataset_type == "features":
        return build_sample_feature_data()
    raise ValueError(f"Dataset type tidak dikenal: {dataset_type}")
