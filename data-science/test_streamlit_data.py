import tempfile
import unittest
from pathlib import Path

from streamlit_data import load_csv_or_sample


class StreamlitDataFallbackTest(unittest.TestCase):
    def test_missing_cleaned_csv_returns_sample_data(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            missing_path = Path(tmpdir) / "retail_cleaned.csv"

            data = load_csv_or_sample(missing_path, "cleaned")

            self.assertGreater(len(data), 0)
            self.assertIn("Datetime", data.columns)
            self.assertIn("Product", data.columns)
            self.assertIn("Estimated_Product_Price_IDR", data.columns)

    def test_missing_feature_csv_returns_sample_data(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            missing_path = Path(tmpdir) / "retail_feature_engineered.csv"

            data = load_csv_or_sample(missing_path, "features")

            self.assertGreater(len(data), 0)
            self.assertIn("YearMonth", data.columns)
            self.assertIn("Rolling_Mean_3", data.columns)
            self.assertIn("Status_Stok", data.columns)


if __name__ == "__main__":
    unittest.main()
