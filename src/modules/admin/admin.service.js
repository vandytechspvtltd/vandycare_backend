const crypto = require('crypto');
const database = require('../../database/database');
const config = require('../../config/env');
const authService = require('../auth/auth.service');
const doctorService = require('../doctor/doctor.service');
const { verifyPassword } = require('../../utils/password');
const { validateReject } = require('./admin.validation');

function safeAdminPassword(password) {
    if (config.adminPasswordHash) return verifyPassword(password, config.adminPasswordHash);
    if (!config.adminPassword || typeof password !== 'string') return false;
    const supplied = Buffer.from(password);
    const expected = Buffer.from(config.adminPassword);
    return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

function login(emailInput, password) {
    const email = String(emailInput || '').trim().toLowerCase();
    if (!config.adminEmail || !safeAdminPassword(password) || email !== config.adminEmail) return { error: [401, 'Invalid admin credentials.'] };
    const user = database.users.admin_1 || { id: 'admin_1', email: config.adminEmail, role: 'ADMIN', name: 'Administrator', isActive: true };
    database.users.admin_1 = user;
    return { data: { accessToken: authService.createAccessToken(user), refreshToken: authService.createRefreshToken(user), user } };
}

function refresh(token) {
    try { return { data: authService.rotateRefreshToken(token, 'ADMIN') }; }
    catch (error) { return { error: [401, 'Invalid or expired refresh token'] }; }
}

function doctorDetails(registration) {
    const doctor = database.doctors.find(item => item.id === registration.userId);
    return doctorService.toDoctorProfile(registration, doctor);
}

function listPendingDoctors() {
    return database.doctorRegistrations.filter(item => item.status === 'PENDING').map(doctorDetails);
}

function getDoctor(id) {
    const registration = doctorService.findRegistration(id);
    if (registration) return doctorDetails(registration);
    const doctor = database.doctors.find(item => item.id === id);
    if (!doctor) return null;
    const user = database.users[id] || {};
    return { id, name: doctor.name, email: user.email || null, mobile: user.phone || null, specialization: doctor.specialty || null, qualification: doctor.qualification || null, experience: doctor.experience_years ?? null, registrationNumber: doctor.registration_number || null, status: user.status || (doctor.is_verified ? 'APPROVED' : 'PENDING'), isActive: doctor.is_active !== false, registrationDate: user.registrationDate || null };
}

function approveDoctor(id) {
    const registration = doctorService.findRegistration(id);
    if (!registration) return null;
    registration.status = 'APPROVED';
    registration.isActive = true;
    registration.rejectionReason = null;
    const user = database.users[registration.userId];
    user.status = 'APPROVED';
    user.isActive = true;
    let doctor = database.doctors.find(item => item.id === registration.userId);
    if (!doctor) {
        doctor = { id: registration.userId, name: registration.name, specialty: registration.specialization || 'General Physician', qualification: registration.qualification, experience_years: registration.experience, registration_number: registration.registrationNumber, clinic_name: registration.clinicName, clinic_address: registration.clinicAddress, about: registration.bio, consultation_fee: config.defaultConsultationFee, rating: 0, review_count: 0, is_online: false, is_verified: true, is_active: true };
        database.doctors.push(doctor);
    } else {
        Object.assign(doctor, { is_verified: true, is_active: true });
        if (!Number.isFinite(Number(doctor.consultation_fee)) || Number(doctor.consultation_fee) < 0) doctor.consultation_fee = config.defaultConsultationFee;
    }
    return doctorDetails(registration);
}

function rejectDoctor(id, reason) {
    const validationError = validateReject({ reason });
    if (validationError) return { error: [400, validationError] };
    const registration = doctorService.findRegistration(id);
    if (!registration) return null;
    registration.status = 'REJECTED';
    registration.isActive = false;
    registration.rejectionReason = String(reason || 'Registration rejected by admin.').trim();
    const user = database.users[registration.userId];
    if (user) { user.status = 'REJECTED'; user.isActive = false; }
    const doctor = database.doctors.find(item => item.id === registration.userId);
    if (doctor) doctor.is_active = false;
    return doctorDetails(registration);
}

function setDoctorActive(id, active) {
    const registration = doctorService.findRegistration(id);
    if (!registration || registration.status !== 'APPROVED') return null;
    registration.isActive = active;
    const user = database.users[registration.userId];
    user.isActive = active;
    const doctor = database.doctors.find(item => item.id === registration.userId);
    if (doctor) doctor.is_active = active;
    return doctorDetails(registration);
}

function listDoctors() {
    const registered = database.doctorRegistrations.map(doctorDetails);
    const registeredIds = new Set(database.doctorRegistrations.map(item => item.userId));
    const legacy = database.doctors.filter(item => !registeredIds.has(item.id)).map(doctor => getDoctor(doctor.id));
    return [...registered, ...legacy];
}

function patientDetails(user) {
    return { id: user.id, name: user.name || database.profiles[user.id]?.name || null, email: user.email || database.profiles[user.id]?.email || null, mobile: user.phone || null, role: 'PATIENT', profile: database.profiles[user.id] || null, isProfileCompleted: Boolean(user.isProfileCompleted) };
}

function listPatients() { return Object.values(database.users).filter(user => user.role === 'PATIENT').map(patientDetails); }
function getPatient(id) { const user = database.users[id]; return user && user.role === 'PATIENT' ? patientDetails(user) : null; }

module.exports = { login, refresh, listPendingDoctors, getDoctor, approveDoctor, rejectDoctor, setDoctorActive, listDoctors, listPatients, getPatient };