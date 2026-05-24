const express = require("express");
const {
  registerDeviceToken,
  sendTestPushNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/register-device", registerDeviceToken);
router.post("/test-push", sendTestPushNotification);

module.exports = router;
