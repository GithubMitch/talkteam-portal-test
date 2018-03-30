
/*
 * GET home page.
 */
 var Cloudant = require('cloudant');
 var username = "df3909e9-2680-472f-9deb-9638cf73c572-bluemix";
 var password = "6b0a6bfddb9da34d09680a00a78eecb14a4724bf99e2e426f0730ab5ebdf9cd7";
 var cloudant = Cloudant({account:username, password:password});
 var admin_db;
 var db_freshContent = '';
 var defaultLang = 'en';

exports.index = function(req, res){
  console.log("before rendering : ", req.session.lang);
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en") || !req.session.lang ) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
  };

  console.log("before rendering oldLang: ", req.session.oldLang)
  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.oldLang = 'nl';
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    // req.session.reload( function (err) {
      // console.log("session reload")
      res.render('index.html', {
        title: 'home',
        username: req.session.user,
        admin: req.session.admin,
        _jsonConverter: req.session._jsonConverter,
        lang: req.session.lang
      });
      // console.log("session rendered new lang :", req.session.lang);
    // });
  } else {
    admin_db.get('home', function(err, doc) {
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("session rendered this lang :",  req.session.lang);

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
      return;
    });
  }

};
exports.register = function(req, res){
  console.log("before rendering : ", req.session.lang)
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en")) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
  };

  console.log("before rendering oldLang: ", req.session.oldLang)
  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.oldLang = 'nl';
    var admin_db = cloudant.db.use('admin_db');
  };

  res.render('register.html', {
    title: 'Register',
    username: req.session.user,
    admin: req.session.admin,
    _jsonConverter: req.session._jsonConverter,
    lang: req.session.lang
  });

};
exports.downloads = function(req, res){
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en")) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
    console.log("no language var !")
  };

  console.log("before rendering oldLang: ", req.session.oldLang)
  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.oldLang = 'nl';
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    if (req.session.user){
      res.render('downloads.html', {
        title: 'downloads',
        username: req.session.user,
        admin: req.session.admin,
        _jsonConverter: req.session._jsonConverter,
        lang: req.session.lang
      });
    } else {
      res.redirect('/login');
    }
  } else {
    admin_db.get('downloads', function(err, doc) {
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("retreived doc : \n" + doc);
        if (req.session.user){
          res.render('downloads.html', {
            title: 'downloads',
            username: req.session.user,
            admin: req.session.admin,
            _jsonConverter: db_freshContent,

            lang: req.session.lang
          });
        } else {
          res.redirect('/login');
        }
      } else {
        console.log("ERROR finding : 'Downloads'" + err.message);
        if (req.session.user){
          res.render('downloads.html', {
            title: 'downloads',
            username: req.session.user,
            admin: req.session.admin,
            _jsonConverter: db_freshContent,

            lang: req.session.lang
          });
        } else {
          res.redirect('/login');
        }
      };
      res.end();
      return;
    });
  }
};
exports.about = function(req, res){
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en")) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
    console.log("no language var !")
  };

  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.oldLang = 'nl';
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    res.render('about.html', {
      title: 'about',
      username: req.session.user,
      admin: req.session.admin,
      _jsonConverter: req.session._jsonConverter,
      lang: req.session.lang
    });
  } else {
    admin_db.get('about', function(err, doc) {
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("retreived doc : \n" + doc);
        res.render('about.html', {
          title: 'about',
          username: req.session.user,
          admin: req.session.admin,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      } else {
        console.log("ERROR finding : 'News'" + err.message);
        res.render('about.html', {
          title: 'about',
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
exports.terms = function(req, res){
  console.log("before rendering : ", req.session.lang)
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en")) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
    console.log("no language var !")
  };

  console.log("before rendering oldLang: ", req.session.oldLang)
  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.oldLang = 'nl';
    var admin_db = cloudant.db.use('admin_db');
  };

  if (req.session._jsonConverter){
    res.render('terms.html', {
      title: 'terms',
      username: req.session.user,
      admin: req.session.admin,
      _jsonConverter: req.session._jsonConverter,
      lang: req.session.lang
    });
  } else {
    admin_db.get('terms', function(err, doc) {
      if (!err) {
        db_freshContent = doc.reqContent;
        console.log("retreived doc : \n" + doc);
        res.render('terms.html', {
          title: 'terms',
          username: req.session.user,
          admin: req.session.admin,
          username: req.session.user,
          _jsonConverter: db_freshContent,
          lang: req.session.lang
        });
      } else {
        console.log("ERROR finding : 'Terms'" + err.message);
        res.render('terms.html', {
          title: 'terms',
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
};
exports.toc = function(req, res){
  if (!req.session.user) {
    res.redirect('login')
  } else {
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
      userlist: req.session.userlist,
      userdocs: req.session.userDocs
    });
  }
};
exports.faq = function(req, res){
  if (!req.session._jsonConverter || req.session._jsonConverter){
    req.session._jsonConverter = ''
  }

  console.log("before rendering : ", req.session.lang)
  if (req.url.includes("?clang=nl")) {
    delete req.session.lang;
    req.session.lang = 'nl';
  } else if (req.url.includes("?clang=en")) {
    delete req.session.lang;
    req.session.lang = 'en';
  } else {
    console.log("no language var !")
  };

  console.log("before rendering oldLang: ", req.session.oldLang)
  if (req.session.lang == 'nl') {
    req.session.oldLang = 'en';
  } else {
    req.session.oldLang = 'nl';
  };

  res.render('faq.html', {
    title: 'F.A.Q.',
    admin: req.session.admin,
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
exports.blog = function(req, res){
  if (!req.session._jsonConverter || req.session._jsonConverter){
    req.session._jsonConverter = ''
  }
  //Timestamp
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  }
  if(mm<10) {
      mm = '0'+mm
  }
  uniqueTimeStamp = Date.now();
  timeStamp = yyyy + mm + dd;
  timeStampFormat = dd + '-' + mm + '-' + yyyy;
  var blog = cloudant.db.use('blog');

  blog.fetch({include_docs:true}, function (err, data) {
    var blog_posts = [];
    data.rows.forEach(function(rows) {
      blog_posts.push(rows.doc);
    });
  function descPostDates() {
    blog_posts.sort(function(a, b){return b.blogpost_date-a.blogpost_date});

  }
  descPostDates();

    req.session.blog_posts = blog_posts;
    // console.log("ALL POSTS : \n", blog_posts);
    // console.log(printblogRows);
    // delete req.session.userlist;
    res.render('blog/blog.html', {
      title: 'BLOG',
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
      _jsonConverter: req.session._jsonConverter,
      admin: req.session.admin,
      blog_posts: blog_posts,
      timeStamp: timeStamp,
      timeStampFormat: timeStampFormat,
      uniqueTimeStamp: uniqueTimeStamp,
    });
  });
};
