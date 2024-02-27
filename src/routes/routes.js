const express = require("express");
const uploadController = require("../controller/uploadController");
const uploadStorage = require("../services/fileHandler");

const router = express.Router();

router.post("/upload/single", uploadStorage.single("file"), uploadController.uploadSingleFile);
router.post("/upload/large", uploadController.uploadLarge);
router.post("/upload/multiple", uploadStorage.array("file", 10), uploadController.uploadMultipleFiles);
router.delete("/delete/:fileName", uploadController.deleteFile);
router.get("/list", uploadController.listFile);

module.exports = router;