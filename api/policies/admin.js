/*
 * Allow any authenticated user.
 */
module.exports = function (req, res, ok) {
    //User is allowed. proceed to controller
    if (req.session.Users && req.session.Users.admin) {
        return ok();
    }
    //User is not allowed
    else {
        var requireAdminError = [{name: 'requireAdminError', message: 'You must be an admin.'}]
        req.session.flash = {
            err: requireAdminError
        }
        res.redirect('/admin/auth');
        return;
    }
}
