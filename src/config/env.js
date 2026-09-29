const dotenv = require('dotenv');

dotenv.config();

const config = {
    port: process.env.SERVER_PORT || 5000,
    webrtcStunUrls: (process.env.WEBRTC_STUN_URLS || 'stun:stun.l.google.com:19302').split(',').map(value => value.trim()).filter(Boolean),
    webrtcTurnUrl: (process.env.WEBRTC_TURN_URL || '').trim(),
    webrtcTurnUsername: (process.env.WEBRTC_TURN_USERNAME || '').trim(),
    webrtcTurnCredential: (process.env.WEBRTC_TURN_CREDENTIAL || '').trim(),
    webrtcTurnUrls: (process.env.WEBRTC_TURN_URLS || '').split(',').map(value => value.trim()).filter(Boolean),
    turnSharedSecret: (process.env.TURN_SHARED_SECRET || '').trim(),
    turnCredentialTtlSeconds: Math.max(60, Number(process.env.TURN_CREDENTIAL_TTL_SECONDS || 3600)),
    jwtSecret: (process.env.JWT_SECRET || '').trim(),
    jwtAccessSecret: (process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || '').trim(),
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || process.env.ACCESS_TOKEN_TTL || '1m',
    jwtRefreshSecret: (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || '').trim(),
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminPasswordHash: (process.env.ADMIN_PASSWORD_HASH || '').trim(),
    defaultConsultationFee: Number(process.env.DEFAULT_CONSULTATION_FEE || 500),
    devOtpBypass: String(process.env.DEV_OTP_BYPASS || 'false')
        .trim()
        .toLowerCase() === 'true',
    otpProvider: String(process.env.OTP_PROVIDER || 'console')
        .trim()
        .toLowerCase()
};
if (process.env.NODE_ENV === 'production') {

    const turnConfigured =
        config.webrtcTurnUrl ||
        (
            config.webrtcTurnUrls.length > 0 &&
            config.webrtcTurnUsername &&
            config.webrtcTurnCredential
        );

    if (!turnConfigured) {
        throw new Error(
            'Configure WEBRTC_TURN_URL or WEBRTC_TURN_URLS with WEBRTC_TURN_USERNAME and WEBRTC_TURN_CREDENTIAL.'
        );
    }

    if (!config.jwtAccessSecret || config.jwtAccessSecret.length < 32) {
        throw new Error('JWT_ACCESS_SECRET must be at least 32 characters.');
    }

    if (!config.jwtRefreshSecret || config.jwtRefreshSecret.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be at least 32 characters.');
    }
}

module.exports = config;
