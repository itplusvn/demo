/*
*Allow any authenticated user
*/
module.exports = function (req, res, ok) {
    //User us allowed, proceed to controller
    if (req.session.authenticated) {
        return ok();
    }
    //User is not allowed
    else {
        var requireLoginError = [{name: 'requireLogin', message: 'You must be sign in.'}]
        req.session.flash = {
            err: requireLoginError
        }
        res.redirect('/admin/auth');
        return;
    }
};
