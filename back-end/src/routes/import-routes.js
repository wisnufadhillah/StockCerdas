const express = require("express");
const importController = require("../controllers/import-controller");
const router = express.Router();

router.post("/upload", importController.uploadData);
router.post("/sync", importController.syncApi);

module.exports = router;
