# VandyCare WebRTC & REST Backend (Node.js)

Node.js REST API and authenticated WebRTC signaling service for the Telehealth Android application and doctor browser.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Setup Instructions

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Configure `.env` or the deployment environment:
   ```bash
   SERVER_PORT=5000
   WEBRTC_STUN_URLS=stun:stun.l.google.com:19302
   WEBRTC_TURN_URLS=turn:turn.example.com:3478,turns:turn.example.com:5349
   TURN_SHARED_SECRET=<coturn static-auth-secret>
   TURN_CREDENTIAL_TTL_SECONDS=3600
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```
   Or with live reloading during development:
   ```bash
   npm run dev
   ```

5. **Verify Server Health**:
   Open in your browser or curl:
   ```bash
   curl http://localhost:5000/health
   ```

---

## API Endpoints Overview

All endpoints are mapped to `/v1/`:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/auth/send-otp` | Sends OTP for phone verification |
| `POST` | `/v1/auth/verify-otp` | Verifies OTP and issues JWT auth credentials |
| `POST` | `/v1/auth/refresh-token` | Renews JWT access token |
| `POST` | `/v1/auth/logout` | Revokes current session |
| `GET` | `/v1/queue/live` | Real-time queue status, token, wait time |
| `GET` | `/v1/doctors` | List of doctors with online status & ratings |
| `GET` | `/v1/doctors/:id` | Doctor profile by ID |
| `GET` | `/v1/webrtc/ice-servers` | Returns STUN servers and short-lived TURN credentials |
| `GET` | `/v1/prescriptions/latest` | Latest E-Prescription with medicine breakdown |
| `GET` | `/v1/prescriptions/:id` | Prescription by ID |
| `GET` | `/v1/pharmacy/medicines` | Catalog of medicines with search & filter |
| `POST` | `/v1/pharmacy/orders` | Places a new medicine prescription order |
| `GET` | `/v1/orders/:id/tracking` | Live delivery tracking with delivery rider |

---

## WebRTC Calls

The authenticated endpoint `GET /v1/webrtc/ice-servers` returns the ICE server list for `RTCPeerConnection`. TURN credentials are short-lived and generated with the coturn REST API shared-secret scheme. Configure the same secret as coturn's `static-auth-secret`; production startup requires at least one TURN URL and the secret.

Connect a Socket.IO client to the backend with the access token in `auth.token`. Join with `webrtc:join` and `{ appointmentId }`. The backend relays `webrtc:offer` and `webrtc:answer` messages containing `{ appointmentId, description }`, and `webrtc:ice-candidate` messages containing `{ appointmentId, candidate }`. Listen for `webrtc:peer-joined` and `webrtc:peer-left`; send `webrtc:leave` when ending the call. Only the paid, confirmed appointment's patient and active doctor can join. Media flows peer-to-peer when possible and through TURN when direct ICE fails; the backend relays signaling only.

Both clients must implement the matching WebRTC APIs and Socket.IO protocol. The backend does not carry media. Its current appointment store is in memory, so deploy a shared persistent store and a Socket.IO adapter before running multiple backend instances.

## Deploying to Production

You can deploy this server to any cloud provider:
- **Google Cloud Run**: `gcloud run deploy telehealth-api --source . --port 5000`
- **Render / Railway / Heroku**: Connect repository and set start command to `npm start`
- **AWS / DigitalOcean / VPS**: Run with PM2 (`pm2 start server.js --name telehealth-api`)
