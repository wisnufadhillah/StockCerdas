const express = require("express");
const importController = require("../controllers/import-controller");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "success", service: "Import Worker", timestamp: new Date().toISOString() });
});
router.post("/upload", importController.uploadData);
router.post("/sync", importController.syncApi);

module.exports = router;
