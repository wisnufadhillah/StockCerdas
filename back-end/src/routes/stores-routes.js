const express = require("express");
const storesController = require("../controllers/stores-controller");
const router = express.Router();

router.get("/", storesController.getStores);
router.post("/", storesController.createStore);
router.delete("/:id", storesController.deleteStore);

module.exports = router;
