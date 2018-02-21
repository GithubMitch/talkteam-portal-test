
/*
 * GET home page.
 */
 var Cloudant = require('cloudant');
 var username = "df3909e9-2680-472f-9deb-9638cf73c572-bluemix";
 var password = "6b0a6bfddb9da34d09680a00a78eecb14a4724bf99e2e426f0730ab5ebdf9cd7";
 var cloudant = Cloudant({account:username, password:password});
 var admin_db;
 var db_freshContent = '';

exports.index = function(req, res){

  if (req.url.includes("?clang=nl")) {
    console.log(!req.session.lang == 'en');
    console.log(req.session.lang == 'en');
    console.log(!req.session.lang == 'nl');
    console.log(req.session.lang == 'nl');
    req.session.lang = 'nl';
    console.log('currentURL = ', req.url);
    console.log('Language set  =  NL / Dutch');
    console.log('Using '+req.session.lang+' / DUTCH DB');
    console.log(req.session.lang);
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.lang = 'en';
    // } else if (req.session.lang == 'en' || typeof req.session.lang == 'undefined' || req.url == '/?clang=en') {
    console.log('currentURL = ', req.url);
    console.log('Language set  =  Default - EN / English');
    console.log('Using '+req.session.lang+' / ENGLISH DB');
    console.log(req.session.lang);
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    console.log("_jsonConverter REQ SESSION IS HERE");
    res.render('index.html', {
      title: 'home',
      username: req.session.user,
      admin: req.session.admin,
      _jsonConverter: req.session._jsonConverter,
      lang: req.session.lang
    });
  } else {
    admin_db.get('home', function(err, doc) {
      console.log("_jsonConverter REQ SESSION IS NOT THERE");
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("GET found 1 entry: 'Home'");
        console.log("retreived doc : \n" + doc);
        res.render('index.html', {
          title: 'home',
          username: req.session.user,
          admin: req.session.admin,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      } else {
        console.log("ERROR finding : 'Home'" + err.message);
        res.render('index.html', {
          title: 'home',
          username: req.session.user,
          admin: req.session.admin,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      };
      res.end();
      return;
    });

  }
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
      admin: req.session.admin,
      lang: req.session.lang
    });
  } else {
    res.redirect('/login');
  }
};
exports.news = function(req, res){
  if (req.url.includes("?clang=nl") || req.session.lang == 'nl') {
    req.session.lang = 'nl';
    console.log('currentURL = ', req.url);
    console.log('Language set  =  NL / Dutch');
    console.log('Using '+req.session.lang+' / DUTCH DB');
    console.log(req.session.lang);
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
  // } else if (req.session.lang == 'en' || typeof req.session.lang == 'undefined' || req.url == '/?clang=en') {
    req.session.lang = 'en';
    console.log('currentURL = ', req.url);
    console.log('Language set  =  Default - EN / English');
    console.log('Using '+req.session.lang+' / ENGLISH DB');
    console.log(req.session.lang);
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    console.log("REQ SESSION IS HERE");
    res.render('news.html', {
      title: 'news',
      username: req.session.user,
      admin: req.session.admin,
      _jsonConverter: req.session._jsonConverter,
      lang: req.session.lang
    });
  } else {
    admin_db.get('news', function(err, doc) {
      console.log("REQ SESSION IS NOT THERE");
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("GET found 1 entry: 'news'");
        console.log("retreived doc : \n" + doc);
        res.render('news.html', {
          title: 'news',
          username: req.session.user,
          admin: req.session.admin,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      } else {
        console.log("ERROR finding : 'News'" + err.message);
        res.render('news.html', {
          title: 'news',
          username: req.session.user,
          admin: req.session.admin,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      };
      res.end();
      return;
    });

  }


};
exports.thankyou = function(req, res){
  res.render('thankyou.html', {
    title: 'Thank you',
    username: req.session.user,
    admin: req.session.admin,
    lang: req.session.lang
  });
};
exports.admin = function(req, res){
  res.render('admin.html', {
    title: 'Admin',
    username: req.session.user,
    admin: req.session.admin,
    lang: req.session.lang
  });
};
exports.login = function(req, res){
  if (req.session.user){
    res.redirect('/');
  } else {
    res.render('login.html', {
      title: 'Login',
      username: req.session.user,
      admin: req.session.admin,
      lang: req.session.lang
    });
  }
};
exports.logout = function(req, res){
  res.render('logout.html', {
    title: 'Logout',
    username: req.session.user,
    admin: req.session.admin,
    lang: req.session.lang
  });
  req.session.destroy();
  // res.send("logout success!");
  console.log("Logout succesfull");
};
exports.content = function(req, res){
  res.render('content.html', {
    title: 'Content',
    username: req.session.user,
    admin: req.session.admin,
    lang: req.session.lang
  });
};
exports.toc = function(req, res){
  res.render('toc.html', {
    title: 'toc',
    username: req.session.user,
    organisationName:req.session.organisationName,
    organisationEmail: req.session.organisationEmail,
    _id: req.session._id,
    licensekey: req.session.licensekey,
    endDate: req.session.endDate,
    startDate: req.session.endDate,
    active: req.session.active,
    admin: req.session.admin,
    userRows: req.session.userRows,
    userlist: req.session.userlist
  });
};
exports.faq = function(req, res){
    if (!req.session._jsonConverter || req.session._jsonConverter){
      req.session._jsonConverter = ''
    }
  res.render('faq.html', {
    title: 'F.A.Q.',
    username: req.session.user,
    organisationName:req.session.organisationName,
    organisationEmail: req.session.organisationEmail,
    _id: req.session._id,
    licensekey: req.session.licensekey,
    endDate: req.session.endDate,
    startDate: req.session.endDate,
    active: req.session.active,
    userlist: req.session.userlist,
    lang: req.session.lang,
    _jsonConverter: req.session._jsonConverter
  });
};
