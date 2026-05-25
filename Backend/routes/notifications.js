const express = require("express");
const {
  registerDeviceToken,
  sendDailyPhraseNotification,
  sendTestPushNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/register-device", registerDeviceToken);
router.post("/send-daily-phrase", sendDailyPhraseNotification);
router.post("/test-push", sendTestPushNotification);

module.exports = router;
