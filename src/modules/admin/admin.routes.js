const express = require('express');
const authenticate = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/roleMiddleware');
const controller = require('./admin.controller');

const router = express.Router();
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/refresh-token', controller.refresh);
router.use(authenticate, requireRole('ADMIN'));
router.get('/doctors/pending', controller.pendingDoctors);
router.get('/doctors', controller.doctors);
router.get('/doctors/:doctorId', controller.doctorDetails);
router.post('/doctors/:doctorId/approve', controller.approve);
router.post('/doctors/:doctorId/reject', controller.reject);
router.post('/doctors/:doctorId/activate', controller.activate);
router.post('/doctors/:doctorId/deactivate', controller.deactivate);
router.get('/patients', controller.patients);
router.get('/patients/:patientId', controller.patientDetails);

module.exports = router;