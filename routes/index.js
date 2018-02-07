
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { username: req.session.user });
};
exports.register = function(req, res){
  res.render('register.html', { username: req.session.user });
};
exports.downloads = function(req, res){
  if (req.session.user){
    res.render('downloads.html', { username: req.session.user });
  } else {
    res.redirect('/login');
  }
};
exports.news = function(req, res){
    res.render('news.html', { username: req.session.user });
};
exports.thankyou = function(req, res){
  res.render('thankyou.html', { username: req.session.user });
};
exports.admin = function(req, res){
  res.render('admin.html', { username: req.session.user });
};
exports.login = function(req, res){
  if (req.session.user){
    res.redirect('/');
  } else {
    res.render('login.html', { username: req.session.user });
  }
};
exports.logout = function(req, res){
  res.render('logout.html', { username: req.session.user });
  req.session.destroy();
  // res.send("logout success!");
  console.log("Logout succesfull");
};
exports.content = function(req, res){
  res.render('content.html', { username: req.session.user });
};
exports.toc_user = function(req, res){
  res.render('toc_user.html', {
    username: req.session.user,
    organisationName:req.session.organisationName,
    organisationEmail: req.session.organisationEmail,
    _id: req.session._id,
    licensekey: req.session.licenseKey,
    endDate: req.session.endDate,
    startDate: req.session.endDate,
    active: req.session.active
  });
};
