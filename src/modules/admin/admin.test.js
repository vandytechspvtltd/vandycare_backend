const assert = require('node:assert/strict');
const { test } = require('node:test');

const config = require('../../config/env');
const database = require('../../database/database');
const adminService = require('./admin.service');
const authService = require('../auth/auth.service');

test('admin login issues rotating refresh tokens restricted to admins', () => {
    const savedConfig = {
        adminEmail: config.adminEmail,
        adminPassword: config.adminPassword,
        adminPasswordHash: config.adminPasswordHash,
        jwtAccessSecret: config.jwtAccessSecret,
        jwtRefreshSecret: config.jwtRefreshSecret
    };
    const oldAdmin = database.users.admin_1;
    const oldPatient = database.users['admin-refresh-test-patient'];
    const refreshTokenCount = database.refreshTokens.length;

    try {
        config.adminEmail = 'admin-refresh-test@example.invalid';
        config.adminPassword = 'test-password';
        config.adminPasswordHash = '';
        config.jwtAccessSecret = 'admin-refresh-test-access-secret';
        config.jwtRefreshSecret = 'admin-refresh-test-refresh-secret';

        const login = adminService.login(config.adminEmail, config.adminPassword);
        assert.ok(login.data.refreshToken);

        const rotation = adminService.refresh(login.data.refreshToken);
        assert.ok(rotation.data.accessToken);
        assert.ok(rotation.data.refreshToken);
        assert.equal(rotation.data.user.role, 'ADMIN');
        assert.equal(adminService.refresh(login.data.refreshToken).error[0], 401);

        const patient = { id: 'admin-refresh-test-patient', role: 'PATIENT' };
        database.users[patient.id] = patient;
        const patientRefreshToken = authService.createRefreshToken(patient);
        assert.equal(adminService.refresh(patientRefreshToken).error[0], 401);
        const patientRecord = database.refreshTokens.find(item => item.userId === patient.id);
        assert.equal(patientRecord.revokedAt, null);
    } finally {
        config.adminEmail = savedConfig.adminEmail;
        config.adminPassword = savedConfig.adminPassword;
        config.adminPasswordHash = savedConfig.adminPasswordHash;
        config.jwtAccessSecret = savedConfig.jwtAccessSecret;
        config.jwtRefreshSecret = savedConfig.jwtRefreshSecret;
        if (oldAdmin) database.users.admin_1 = oldAdmin;
        else delete database.users.admin_1;
        if (oldPatient) database.users['admin-refresh-test-patient'] = oldPatient;
        else delete database.users['admin-refresh-test-patient'];
        database.refreshTokens.splice(refreshTokenCount);
    }
});