
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', {
    title: 'home',
    username: req.session.user,
    admin: req.session.admin
  });
};
exports.register = function(req, res){
  res.render('register.html', {
    title: 'Register',
    username: req.session.user,
    admin: req.session.admin
  });
};
exports.downloads = function(req, res){
  if (req.session.user){
    res.render('downloads.html', {
      title: 'Downloads',
      username: req.session.user,
      admin: req.session.admin
    });
  } else {
    res.redirect('/login');
  }
};
exports.news = function(req, res){
    res.render('news.html', {
      title: 'News',
      username: req.session.user,
      admin: req.session.admin
    });
};
exports.thankyou = function(req, res){
  res.render('thankyou.html', {
    title: 'Thank you',
    username: req.session.user,
    admin: req.session.admin
  });
};
exports.admin = function(req, res){
  res.render('admin.html', {
    title: 'Admin',
    username: req.session.user,
    admin: req.session.admin
  });
};
exports.login = function(req, res){
  if (req.session.user){
    res.redirect('/');
  } else {
    res.render('login.html', {
      title: 'Login',
      username: req.session.user,
      admin: req.session.admin
    });
  }
};
exports.logout = function(req, res){
  res.render('logout.html', {
    title: 'Logout',
    username: req.session.user,
    admin: req.session.admin
  });
  req.session.destroy();
  // res.send("logout success!");
  console.log("Logout succesfull");
};
exports.content = function(req, res){
  res.render('content.html', {
    title: 'Content',
    username: req.session.user,
    admin: req.session.admin
  });
};
exports.toc_user = function(req, res){
  res.render('toc_user.html', {
    title: 'toc_user',
    username: req.session.user,
    organisationName:req.session.organisationName,
    organisationEmail: req.session.organisationEmail,
    _id: req.session._id,
    licensekey: req.session.licensekey,
    endDate: req.session.endDate,
    startDate: req.session.endDate,
    active: req.session.active,
    admin: req.session.admin
  });
};
