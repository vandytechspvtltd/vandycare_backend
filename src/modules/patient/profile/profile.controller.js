const profileService = require('./profile.service');


function getProfile(req, res) {

    const profile = profileService.getProfile(req.user.id);

    return res.json({
        success: true,
        profile: profile || null,
        is_profile_completed: Boolean(req.user.isProfileCompleted)
    });
}

function saveProfile(req, res) {

    const input = {
        ...(req.body || {})
    };

    if (req.file) {
        input.image = `/uploads/profile/${req.file.filename}`;
    }

    const profile = profileService.saveProfile(
        req.user,
        input
    );

    if (profile.error) {
        return res.status(400).json({
            success: false,
            message: profile.error
        });
    }

    return res.status(200).json({
        success: true,
        profile,
        is_profile_completed: true
    });
}

module.exports = {
    getProfile,
    createProfile: saveProfile,
    updateProfile: saveProfile
};
