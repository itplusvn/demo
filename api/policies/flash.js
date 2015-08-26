/**
 * Author: itplusvn
 * Created Date: 7/21/2015
 * Email: itplusvn@gmail.com
 * Skype: stupid_253
 */
module.exports = function(req, res, next) {

  res.locals.flash = {};

  if(!req.session.flash) return next();

  res.locals.flash = _.clone(req.session.flash);

  // clear flash
  req.session.flash = {};

  next();
};
