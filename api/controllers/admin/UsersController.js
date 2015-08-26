/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
module.exports = {
  'new': function (req, res) {
    res.view();
  },
  index: function (req, res) {
    Users.find(function (err, listUser) {
      //listUser.forEach(function(listItem){
      //  var createdDate = moment(listItem.createdAt).format('DD-MM-YYYY');
      //  listUser.createdAt = createdDate;
      //});
      res.view({listUser: listUser, formatDate: moment});
    })

  },

  //*------- Create User --------*
  create: function (req, res, next) {
    var Passwords = require('machinepack-passwords');
    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('pass_confirmation'),
      difficulty: 10,
    }).exec({
      // An unexpected error occurred.
      error: function (err) {
        return res.negotiate(err);
      },
      // OK.
      success: function (encryptedPassword) {
        Users.create({
          username: req.param('username'),
          firstname: req.param('firstname'),
          lastname: req.param('lastname'),
          email: req.param('email'),
          birthday: req.param('birthday'),
          telephone: req.param('telephone'),
          address: req.param('address'),
          encryptedPassword: encryptedPassword,
        }, function userCreated(err, newUser) {
          if (err) {
            console.log("err: ", err);
            console.log("err.invalidAttributes: ", err.invalidAttributes)
            // Otherwise, send back something reasonable as our error response.
            return res.negotiate(err);
          }
          // Send back the id of the new user
          res.redirect('admin/users');
        });
      }
    });

    //
    //var infoUser = req.params.all();
    //Users.create(infoUser, function userCreated (err, user) {
    //  //if there's an error
    //  if (err) {
    //    req.session.flash = {
    //      err:err
    //    }
    //    //if err redirect back to sign up
    //    return res.redirect('admin/users/new');
    //  }
    //  //After successfully creating the user
    //  //redirect to show all users
    //  res.redirect('admin/users');
    //})
  },
  profile: function (req, res, next) {
// render the profile view (e.g. /views/show.ejs)
    Users.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user

      });
    });
  },
//render the edit view edit.ejs
  edit: function (req, res, next) {
    //Find the user from the id passed in via params
    Users.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }
      res.view({
        user: user,
        formatDate: moment
      });
    });
  },
  //Process the info from edit view
  update: function (req, res, next) {
    var id = req.param('userInfoId');
    var checkPass = req.param('encryptedPassword');
    var passOld = req.param('pass_old');
    var passNew = req.param('pass_confirmation');
    if (passOld && passNew) {
      var Passwords = require('machinepack-passwords');
      // Compare a plaintext password attempt against an already-encrypted version.
      Passwords.checkPassword({
        passwordAttempt: passOld,
        encryptedPassword: checkPass,
      }).exec({
        // An unexpected error occurred.
        error: function (err) {
          console.log("err: ", err);
        },
        // Password attempt does not match already-encrypted version
        incorrect: function () {
          console.log("Password incorrect ");
        },
        // OK.
        success: function () {
          console.log(checkPass);
          // Encrypt a string using the BCrypt algorithm.
          Passwords.encryptPassword({
            password: passNew,
          }).exec({
            // An unexpected error occurred.
            error: function (err) {
              return res.negotiate(err);
            },
            // OK.
            success: function (result) {
              Users.update(id,{
                username: req.param('username'),
                firstname: req.param('firstname'),
                lastname: req.param('lastname'),
                email: req.param('email'),
                birthday: req.param('birthday'),
                telephone: req.param('telephone'),
                address: req.param('address'),
                encryptedPassword: result,
              }, function(err, newUser) {
                if (err) {
                  console.log("err: ", err);
                  console.log("err.invalidAttributes: ", err.invalidAttributes)
                  // Otherwise, send back something reasonable as our error response.
                  return res.negotiate(err);
                }
                console.log(result);
                // Send back the id of the new user
                res.redirect('admin/users');
              });
            },
          });
        },
      });
    } else {

      Users.update(id, req.params.all(), function (err, user) {
        if (err) {
          return next(err);
        }
        res.redirect('admin/users');
      });
    }


  },
  destroy: function (req, res, next) {
    Users.findOne(req.param('id'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next('User doesn\'t exit.');
      }
      Users.destroy(req.param('id'), function userDestroyed(err) {
        if (err) {
          return next(err);
        }
      });
      res.redirect('/admin/users');
    });
  },
  _config: {
    locals: {
      layout: 'layout/layout-admin'
    }
  }
};

