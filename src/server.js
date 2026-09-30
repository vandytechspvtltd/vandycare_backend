const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const path = require('path');

const { Server: SocketServer } = require('socket.io');
const swaggerUi = require('swagger-ui-express');

const config = require('./config/env');
const swaggerDocument = require('./config/swagger');

const authenticate = require('./middleware/authMiddleware');

const webrtcService = require('./modules/webrtc/webrtc.service');
const attachWebRtcSignaling = require('./modules/webrtc/signaling');

const videoCallRoutes = require('./modules/videoCall/videoCall.routes');
const attachVideoCallSignaling = require('./modules/videoCall/videoCall.signaling');

const patientRoutes = require('./modules/patient/routes');
const doctorRoutes = require('./modules/doctor/doctor.routes');
const adminRoutes = require('./modules/admin/admin.routes');

const authRoutes = require('./modules/auth/auth.routes');

const app = express();

const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: true
    }
});

app.set('io', io);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(express.json());

/*
 * Profile images / uploaded files
 *
 * Example:
 * https://your-domain.com/uploads/profile/image.jpg
 */
app.use(
    '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
);

/* =========================================================
   SWAGGER
========================================================= */

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.get(
    '/api-docs.json',
    (req, res) => res.json(swaggerDocument)
);

app.use(
    '/v1/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.get(
    '/v1/api-docs.json',
    (req, res) => res.json(swaggerDocument)
);

/* =========================================================
   REQUEST LOGGER
========================================================= */

app.use((req, res, next) => {

    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );

    next();
});

/* =========================================================
   API INFO
========================================================= */

const apiInfo = (req, res) => {

    return res.json({
        success: true,
        message: 'VandyCare Backend API is running.',
        version: '2.0.0',
        docs: '/v1/api-docs',
        openapi: '/v1/api-docs.json'
    });
};

app.get('/', apiInfo);
app.get('/v1', apiInfo);
app.get('/v1/', apiInfo);

/* =========================================================
   HEALTH
========================================================= */

const healthInfo = (req, res) => {

    return res.json({
        status: 'ok',
        service: 'VandyCare Backend API',
        version: '2.0.0',

        webrtcSignalingAvailable: true,

        turnConfigured: Boolean(
            config.webrtcTurnUrls.length &&
            config.webrtcTurnUsername &&
            config.webrtcTurnCredential
        ),

        authenticationConfigured: Boolean(
            jwt &&
            config.jwtAccessSecret &&
            config.jwtRefreshSecret
        )
    });
};

app.get('/health', healthInfo);
app.get('/v1/health', healthInfo);

/* =========================================================
   AUTH
========================================================= */

app.use(
    '/v1/auth',
    authRoutes
);

/* =========================================================
   VIDEO CALL
========================================================= */

app.use(
    '/v1',
    videoCallRoutes
);

/* =========================================================
   PATIENT
========================================================= */

app.use(
    '/v1',
    patientRoutes
);

/* =========================================================
   DOCTOR
========================================================= */

app.use(
    '/v1/doctor',
    doctorRoutes
);

app.use(
    '/v1/doctor-portal',
    doctorRoutes
);

/* =========================================================
   ADMIN
========================================================= */

app.use(
    '/v1/admin',
    adminRoutes
);

/* =========================================================
   HOME
========================================================= */

app.use(
    '/api/home',
    require('./modules/patient/home/home.routes')
);

/* =========================================================
   WEBRTC ICE SERVERS
========================================================= */

app.get(
    '/v1/webrtc/ice-servers',
    authenticate,
    (req, res) => {

        return res.json({
            success: true,
            data: webrtcService.iceServerConfiguration(
                req.user.id
            )
        });
    }
);

/* =========================================================
   WEBRTC SIGNALING
========================================================= */

attachWebRtcSignaling(io);

attachVideoCallSignaling(io);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        err.type === 'entity.parse.failed'
    ) {

        return res.status(400).json({
            success: false,
            message: 'Request body contains invalid JSON.'
        });
    }

    return next(err);
});

/* =========================================================
   SERVER
========================================================= */

server.listen(
    config.port,
    '0.0.0.0',
    () => {

        console.log(
            '===================================================='
        );

        console.log(
            `Telehealth API & WebRTC signaling server running on :${config.port}`
        );

        console.log(
            `TURN configured: ${Boolean(
                config.webrtcTurnUrls.length &&
                config.webrtcTurnUsername &&
                config.webrtcTurnCredential
            )}`
        );

        console.log(
            `Base URL: http://localhost:${config.port}/v1/`
        );

        console.log(
            `Health Check: http://localhost:${config.port}/health`
        );

        console.log(
            `Swagger docs available at: http://localhost:${config.port}/api-docs`
        );

        console.log(
            `Swagger docs v1 alias: http://localhost:${config.port}/v1/api-docs`
        );

        console.log(
            `OpenAPI JSON available at: http://localhost:${config.port}/api-docs.json`
        );

        console.log(
            `Uploads available at: http://localhost:${config.port}/uploads/`
        );

        console.log(
            '===================================================='
        );
    }
);

module.exports = app;