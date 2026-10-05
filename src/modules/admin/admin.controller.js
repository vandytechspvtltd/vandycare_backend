const service = require('./admin.service');

function login(req, res) {
    const result = service.login(req.body?.email, req.body?.password);
    if (result.error) return res.status(result.error[0]).json({ success: false, message: result.error[1] });
    return res.json({ success: true, data: result.data, access_token: result.data.accessToken, refresh_token: result.data.refreshToken });
}

function refresh(req, res) {
    const result = service.refresh(req.body?.refreshToken || req.body?.refresh_token);
    if (result.error) return res.status(result.error[0]).json({ success: false, message: result.error[1] });
    return res.json({ success: true, data: result.data, access_token: result.data.accessToken, refresh_token: result.data.refreshToken });
}

function collection(method) {
    return (req, res) => res.json({ success: true, data: service[method]() });
}

function doctorDetails(req, res) { const data = service.getDoctor(req.params.doctorId); return data ? res.json({ success: true, data }) : res.status(404).json({ success: false, message: 'Doctor not found.' }); }
function approve(req, res) { const data = service.approveDoctor(req.params.doctorId); return data ? res.json({ success: true, message: 'Doctor approved.', data }) : res.status(404).json({ success: false, message: 'Pending doctor registration not found.' }); }
function reject(req, res) { const result = service.rejectDoctor(req.params.doctorId, req.body?.reason); if (result?.error) return res.status(result.error[0]).json({ success: false, message: result.error[1] }); return result ? res.json({ success: true, message: 'Doctor rejected.', data: result }) : res.status(404).json({ success: false, message: 'Doctor registration not found.' }); }
function setActive(active) { return (req, res) => { const data = service.setDoctorActive(req.params.doctorId, active); return data ? res.json({ success: true, message: `Doctor ${active ? 'activated' : 'deactivated'}.`, data }) : res.status(404).json({ success: false, message: 'Approved doctor not found.' }); }; }
function patientDetails(req, res) { const data = service.getPatient(req.params.patientId); return data ? res.json({ success: true, data }) : res.status(404).json({ success: false, message: 'Patient not found.' }); }

module.exports = { login, refresh, pendingDoctors: collection('listPendingDoctors'), doctors: collection('listDoctors'), doctorDetails, approve, reject, activate: setActive(true), deactivate: setActive(false), patients: collection('listPatients'), patientDetails };