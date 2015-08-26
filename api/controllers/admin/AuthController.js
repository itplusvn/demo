/**
 * AuthController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcryptjs');
module.exports = {
  index:function(req, res){
    res.view();
  },
  login: function(req, res, next) {
    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      res.redirect('/admin/auth');
      return;
    }
    // Try to find the user by there email address.
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    // User.findOneByEmail(req.param('email')).done(function(err, user) {
    Users.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') + ' not found.'
        }]
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/admin/auth');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);
        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          var usernamePasswordMismatchError = [{
            name: 'usernamePasswordMismatch',
            message: 'Invalid username and password combination.'
          }]
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          res.redirect('/admin/auth');
          return;
        }

        // Log users in
        req.session.authenticated = true;
        req.session.Users = user;

        // Change status to online
        user.online = true;
        user.save(function(err, user) {
          if (err) return next(err);

          //// Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
          //user.publishUpdate(user.id, {
          //  loggedIn: true,
          //  id: user.id,
          //  name: user.name,
          //  action: ' has logged in.'
          //});

          // If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
          // This is used in conjunction with config/policies.js file
          if (req.session.Users.admin) {
            res.redirect('/admin/dashboard');
            return;
          }else{
            var notAdmin = [{
              name: 'requireAdminError',
              message: 'You must be an admin.'
            }]
            req.session.flash = {
              err: notAdmin
            }
            res.redirect('/admin/auth');
            return;
          }

        });
      });
    });
  },

  destroy: function(req, res, next) {

    Users.findOne(req.session.Users.id, function foundUser(err, user) {

      var userId = req.session.Users.id;

      if (user) {
        // The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
        Users.update(userId, {
          online: false
        }, function(err) {
          if (err) return next(err);

          // Inform other sockets (e.g. connected sockets that are subscribed) that the session for this user has ended.
          Users.publishUpdate(userId, {
            loggedIn: false,
            id: userId,
            name: user.name,
            action: ' has logged out.'
          });

          // Wipe out the session (log out)
          req.session.destroy();

          // Redirect the browser to the sign-in screen
          res.redirect('/admin/auth');
        });
      } else {

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        res.redirect('/admin/auth');
      }
    });
  },
  _config: {
    locals: {
      layout: 'layout/layout-auth'
    }
  }
};

