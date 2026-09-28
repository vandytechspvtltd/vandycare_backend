const service = require('./doctor.service');
const videoCallService = require('../videoCall/videoCall.service');


// =====================================================
// DOCTOR AUTH
// =====================================================

function register(req, res) {
    const result = service.register(req.body || {});

    if (result.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    return res.status(201).json({
        success: true,
        message: 'Doctor registration submitted for admin review.',
        data: result.data
    });
}


function login(req, res) {
    const result = service.login(
        req.body?.email,
        req.body?.password
    );

    if (result.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    return res.json({
        success: true,
        data: result.data,
        access_token: result.data.accessToken
    });
}


// =====================================================
// DOCTOR PROFILE
// =====================================================

function profile(req, res) {
    const data = service.getProfile(req.user.id);

    if (!data) {
        return res.status(404).json({
            success: false,
            message: 'Doctor profile not found.'
        });
    }

    return res.json({
        success: true,
        data
    });
}


function status(req, res) {
    const data = service.getStatus(req.user.id);

    if (!data) {
        return res.status(404).json({
            success: false,
            message: 'Doctor status not found.'
        });
    }

    return res.json({
        success: true,
        data
    });
}


function updateProfile(req, res) {
    const result = service.updateProfile(
        req.user.id,
        req.body || {}
    );

    if (result.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    return res.json({
        success: true,
        data: result.data
    });
}


// =====================================================
// APPOINTMENTS
// =====================================================

function appointments(req, res) {
    const result = service.getAppointments(
        req.user.id
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    return res.json({
        success: true,
        data: result || []
    });
}


function appointmentDetails(req, res) {
    const result = service.getAppointment(
        req.user.id,
        req.params.appointmentId
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Appointment not found.'
        });
    }

    return res.json({
        success: true,
        data: result
    });
}


function updateAppointmentStatus(req, res) {
    const result = service.updateAppointmentStatus(
        req.user.id,
        req.params.appointmentId,
        req.body?.status
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Appointment not found.'
        });
    }

    return res.json({
        success: true,
        message: 'Appointment status updated successfully.',
        data: result
    });
}


// =====================================================
// PATIENTS
// =====================================================

function patients(req, res) {
    const result = service.getPatients(
        req.user.id
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    return res.json({
        success: true,
        data: result || []
    });
}


function patientDetails(req, res) {
    const result = service.getPatient(
        req.user.id,
        req.params.patientId
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Patient not found.'
        });
    }

    return res.json({
        success: true,
        data: result
    });
}


// =====================================================
// VIDEO CALL
// =====================================================

function getCall(req, res) {
    const result = videoCallService.getCall(
        req.user,
        req.params.appointmentId
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Call session not found.'
        });
    }

    return res.json({
        success: true,
        data: result
    });
}


function acceptCall(req, res) {
    const result = videoCallService.acceptCall(
        req.user,
        req.params.appointmentId
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Call session not found.'
        });
    }

    return res.json({
        success: true,
        message: 'Call accepted.',
        data: result
    });
}

function rejectCall(req, res) {
    const result = videoCallService.rejectCall(
        req.user,
        req.params.appointmentId,
        req.body?.reason
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Call session not found.'
        });
    }

    return res.json({
        success: true,
        message: 'Call rejected.',
        data: result
    });
}

function endCall(req, res) {
    const result = videoCallService.endCall(
        req.user,
        req.params.appointmentId
    );

    if (result?.error) {
        return res.status(result.error[0]).json({
            success: false,
            message: result.error[1]
        });
    }

    if (!result) {
        return res.status(404).json({
            success: false,
            message: 'Call session not found.'
        });
    }

    return res.json({
        success: true,
        message: 'Call ended.',
        data: result
    });
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {

    // Auth
    register,
    login,

    // Profile
    profile,
    status,
    updateProfile,

    // Appointments
    appointments,
    appointmentDetails,
    updateAppointmentStatus,

    // Patients
    patients,
    patientDetails,

    // Video Call
    getCall,
    acceptCall,
    rejectCall,
    endCall
};