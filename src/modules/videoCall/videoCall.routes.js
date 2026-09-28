const express = require("express");

const authenticate = require(
  "../../middleware/authMiddleware"
);

const controller = require(
  "./videoCall.controller"
);

const router =
  express.Router();

router.get(
  "/video-call/ice-servers",
  authenticate,
  controller.iceServers
);

router.post(
  "/appointments/:appointmentId/call/start",
  authenticate,
  controller.start
);

router.post(
  "/appointments/:appointmentId/call/accept",
  authenticate,
  controller.accept
);

router.post(
  "/appointments/:appointmentId/call/reject",
  authenticate,
  controller.reject
);

router.post(
  "/appointments/:appointmentId/call/end",
  authenticate,
  controller.end
);

router.get(
  "/appointments/:appointmentId/call",
  authenticate,
  controller.get
);

module.exports = router;