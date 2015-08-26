/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    telephone: {
      type: 'string'
    },
    fax: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    gender: {
      type: 'integer'
    },
    birthday: {
      type: 'date'
    },
    website: {
      type: 'string'
    },
    // url for gravatar
    gravatarUrl: {
      type: 'string'
    },
    status: {
      type: 'boolean',
      defaultsTo: false
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },
    username: {
      type: 'string',
      required: true
    },
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    encryptedPassword: {
      type: 'string'
    },
    user_country: {
      model: 'country'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;

    }
  },
  //beforeCreate: function (values, next) {
  //  //This checks to make sure the password confirmation match before creating record
  //  if (!values.password || values.password != values.confirmation) {
  //    return next({err: ["Password doesn't match password confirmation."]});
  //  }
  //  require('bcryptjs').hash(values.password, 10, function passwordEncypted(err, encryptedPassword) {
  //    if (err) {
  //      return next(err);
  //    }
  //    values.encryptedPassword = encryptedPassword;
  //    next();
  //  });
  //
  //}
};

