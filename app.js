var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    fs = require('fs'),
    jade = require('jade'),
    session = require('express-session'),
    MemoryStore = require('memorystore')(session),
    babelPolyfill = require("babel-polyfill"),
    mailer = require('express-mailer'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    uuid = require("node-uuid"),
    passport = require('passport'),
    { Strategy } = require('passport-ibm-connections-oauth'),
    // IBMConnectionsCloudStrategy = require('passport-ibm-connections-cloud').Strategy,
    multer = require('multer');
var app = express(),
    db,
    cloudant,
    fileToUpload,
    currentURL;

var storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'uploads');
    },
    filename: function(req, file, cb){
      filename = Date.now();
      switch (file.mimetype) {
        case 'image/png':
          filename = filename + ".png";
          break;
        case 'image/jpeg':
          filename = filename + ".jpeg";
          break;
        case 'image/gif':
          filename = filename + ".gif";
          break;
        case 'image/svg+xml':
          filename = filename + ".svg";
          break;
        case 'video/mp4':
          filename = filename + ".mp4";
          break;
        case 'video/x-flv':
          filename = filename + ".flv";
          break;
        case 'application/zip':
          filename = filename + ".zip";
          break;
        case 'application/x-rar-compressed':
          filename = filename + ".rar";
          break;
        case 'application/vnd.ms-powerpoint':
          filename = filename + ".ppt";
          break;
        case 'application/msword':
          filename = filename + ".doc";
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          filename = filename + ".docx";
          break;
        case 'application/vnd.ms-powerpoint':
          filename = filename + ".ppt";
          break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          filename = filename + ".pptx";
          break;
        default:  type = "unknown"
          break;
      }
      cb(null, filename);
    }
  }),
  upload = multer({ storage: storage});
// GET connection + DB Credentials
var getAcces = require('./getAcces.js');
var initDBConnection = getAcces.initDBConnection;
var dbCredentials = getAcces.dbCredentials;
var smtpUser = getAcces.smtpUser.user;
var smtpPass = getAcces.smtpUser.pass;
getAcces.initDBConnection();

require('https').globalAgent.options.rejectUnauthorized = false;



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'chatbot')));


app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use('/lib', express.static(__dirname + '/node_modules/domjson/dist')); // redirect domJSON JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/babel-polyfill/dist')); // redirect JS Polyfill
app.use('/js', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect jQuery MMenu
app.use('/css', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect CSS jQuery MMenu
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // Uploads folder
app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

// AUTHORIZATION
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

var strategyParams = {
  hostname: 'apps.ce.collabserv.com',
  clientID: 'app_200077316_1534244218975',
  clientSecret: 'd1c08beeea8a4b30575fd36b69e711861c5ec8de85f782b5a31440cbac41800480c8aeb37e921a3834e9bbfb3394dd3d673232de186b0099aae2b688f675eed11c8cf44a3130c50f41c8f5afeb054b504f3f64b861792111131398233c37de246c8ea3dcb795808aed78223b88a75e1e5da73be40cef6989f35681c5948f90c0',
  // callbackURL: 'http://localhost:3000/auth/ibm-connections-oauth/callback',
  // use top one in production
  callbackURL: 'https://www.talkteam.org/auth/ibm-connections-oauth/callback',
  passReqToCallback: true,
  // optionally define your own `authorizationURL` and `tokenURL` (e.g. when using with IBM Connections >= 5.5)
  // authorizationURL: '/oauth2/endpoint/connectionsProvider/authorize',
  // tokenURL: '/oauth2/endpoint/connectionsProvider/token',
};
passport.use(new Strategy(strategyParams, (req, accessToken, refreshToken, params, profile, done) => {
  // do your magic to load or create a local user here
  if (accessToken, refreshToken, params, profile) {
    req.session.ibmid = {};
    req.session.ibmid.profile = profile;
    return done(null, profile);
  } else {
    done();
  }
}));

var router = express.Router();
router.get(
  '/',
  passport.authenticate('ibm-connections-oauth', {
    session: true,
  })
)
router.get(
  '/callback',
  passport.authenticate('ibm-connections-oauth', {
    // successRedirect: '/toc',
    failureRedirect: '/login',
    session: true,
    failureFlash: true,
    // session: true,
  }),
  (req, res, next) => {
    var talkteam_clients = cloudant.db.use('talkteam_clients');

    try
    {
      // e.g. create a jwt for your application and return to client
      var ibmProfile = req.session.ibmid.profile;
      var orgIDString = req.session.ibmid.profile._json.entry.appData.connections.organizationId;
      var orgID = orgIDString.substr(orgIDString.lastIndexOf(':') + 1);
      var user = req.session.ibmid.profile.userid;
      var IBMuserName = req.session.ibmid.profile.displayName;
      console.log(orgID)

      talkteam_clients.get(orgID, function(err, data) {
        if (!orgID || !data) {
          res.redirect('/login');
        } else if(orgID === data._id) {
          try {
            // console.log("IBMuserName = ", IBMuserName)
            if (data.adminName === IBMuserName || IBMuserName === "Mitchell Seedorf") {
              req.session.admin = true;
            } else {
              req.session.admin = false;
            }
            req.session.user = IBMuserName;
            req.session.organisationName = (data.organisationName || data.orgName);
            req.session.organisationEmail = JSON.stringify(data.organisationEmail || data.adminEmail) ;
            req.session._id = JSON.stringify(data._id);
            req.session.licensekey = JSON.stringify(data.licensekey);
            req.session.endDate = JSON.stringify(data.endDate);
            req.session.startDate = JSON.stringify(data.startDate);
            req.session.active = JSON.stringify(data.active);

            talkteam_clients.fetch({include_docs:true}, function (err, data) {
              var printUserlist = [];
              var userRows = [];
              data.rows.forEach(function(rows) {
                userRows.push(rows.doc);
              });
              data.rows.forEach(function(user) {
                Object.entries(user).forEach(([key]) => {
                  var userKey = key;
                  printUserlist.push(userKey);
                });
              });

              req.session.userRows = userRows;
              req.session.userlist = printUserlist;
              if (req.session.errorMessage) {
                delete req.session.errorMessage;
              }
              delete req.session.userlist;
              console.log("deleted userlist from req.session")
              next(res.redirect('/toc'));
            });
          } catch (error) {
              console.error('An error occurred: ', error);
          }
        } else {
          req.session.errorMessage = "Found no user with this password/username combination. Make sure you login with the correct password and username ór email"
        }
      });
    }
    catch (error) {
        console.error('An error occurred: ', error);
        next(res.redirect('/toc'));
    }
  }
);

app.use('/auth/ibm-connections-oauth', router);
///ROUTES
app.get('/', routes.index);
app.get('/home', routes.index);
app.get('/support', routes.support);
app.get('/downloads', routes.downloads);
app.get('/terms', routes.terms);
app.get('/about', routes.about);
app.get('/thankyou', routes.thankyou);
app.get('/login', routes.login);
app.get('/admin', routes.admin);// same as login
app.get('/toc', routes.toc);
app.get('/faq', routes.faq);
app.get('/service_request', routes.service_request);
app.get('/logout', routes.logout);
app.get('/blog', routes.blog);
// app.get('/logon', routes.logon);

//MAILTEMPLATING
mailer.extend(app, {
  host: 'smtp.office365.com', // hostname
  secure: false,
  requireTLS: true, // only use if the server really does support TLS
  port: 587, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});
// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var Cloudant = require('cloudant');
var username = dbCredentials.username;
var password = dbCredentials.password;
var cloudant = Cloudant({account:username, password:password});

// REGISTER PAGE
app.post('/post/registerform', function(req, res) {
    var regUser = req.body.username;
    var regPassword = req.body.password;
    // Create a new "talkteam_clients" database.
    cloudant.db.create('talkteam_clients', function(err, res) {
      if (err) {
          console.log('Could not create new db: ' + 'talkteam_clients' + ', it might already exist.');
      }
      // Specify the database we are going to use (alice)...
      var talkteam_clients = cloudant.db.use('talkteam_clients');
      // ...and insert a document in it.
      talkteam_clients.insert({
        user: regUser,
        password: regPassword
      }, regUser, function(err, body, header) {
        if (err) {
          return console.log('[talkteam_clients.insert] ', err.message);
        }
      });
    });
    res.redirect('/thankyou');
});

// CONTENT EDIT - ADMIN
app.post('/admin_cm/post', function(req, res) {
  var json = req.body._jsonParser;
  var currentPage = req.body.currentPageVar;
  req.session._jsonConverter = json;
  if (req.session.lang == 'nl') {
    req.session.lang = 'nl'
    var admin_db = cloudant.db.use('admin_db_nl');
  } else {
    req.session.lang = 'en'
    var admin_db = cloudant.db.use('admin_db');
  }

  admin_db.get(currentPage, function(err, doc) {
    if (!err) {
      console.log("GET found 1 entry ! :"+ currentPage);
      var rev = doc._rev;
      // ...and insert a document in it.
      admin_db.insert({
        _id: currentPage,
        _rev: rev,
        reqContent: json
      }, currentPage, function(err, body, header) {
        if (err) {
          console.log("Admin_db err");
        } else {
          console.log("GET succes finding entry:"+ currentPage);
        }
      });
    };
    console.log("POST used : "+ admin_db + "\nIn language : "+ req.session.lang);
    delete req.session._jsonConverter;
    res.redirect('/'+currentPage);
  });
});

// Login endpoint
app.post('/login', function (req, res) {
  var user = req.body.username;
  var password = req.body.password;
  var talkteam_clients = cloudant.db.use('talkteam_clients');

  talkteam_clients.get(req.body.username, function(err, body) {
    if (!err) {
      console.log("Found this profile:")
      console.log("_id: ",body._id)
    } else {
      console.log(err);
    }
  });
  talkteam_clients.get(user, function(err, data) {
    if (!user || !data) {
      console.log("Login failed: non existing user -" + user )
      res.redirect('/login');
    } else if(user === data._id || password === data.password) {
      req.session.admin = false;
      req.session.user = user;
      req.session.organisationName = (data.organisationName || data.orgName);
      req.session.organisationEmail = JSON.stringify(data.organisationEmail || data.adminEmail) ;
      req.session._id = JSON.stringify(data._id);
      req.session.licensekey = JSON.stringify(data.licensekey);
      req.session.endDate = JSON.stringify(data.endDate);
      req.session.startDate = JSON.stringify(data.startDate);
      req.session.active = JSON.stringify(data.active);

      talkteam_clients.fetch({include_docs:true}, function (err, data) {
        var printUserlist = [];
        var userRows = [];
        data.rows.forEach(function(rows) {
          userRows.push(rows.doc);
        });
        data.rows.forEach(function(user) {
          Object.entries(user).forEach(([key]) => {
            var userKey = key;
            printUserlist.push(userKey);
          });
        });

        req.session.userRows = userRows;
        req.session.userlist = printUserlist;
        if (req.session.errorMessage) {
          delete req.session.errorMessage;
        }
        res.redirect('/toc');
        delete req.session.userlist;
        console.log("deleted userlist from req.session")
      });
    } else {
      req.session.errorMessage = "Found no user with this password/username combination. Make sure you login with the correct password and username ór email"
      res.redirect('/login');
    }
  });
});
// Admin login - endpoint ( same )
app.post('/admin', function (req, res) {
  var user = req.body.username;
  var password = req.body.password;
  var talkteam_clients = cloudant.db.use('talkteam_clients');

  talkteam_clients.get(req.body.username, function(err, body) {
    if (!err) {
      console.log("Found this profile:")
      console.log("_id: ",body._id)

    } else {
      console.log(err);
    }
  });
  talkteam_clients.get(user, function(err, data) {
    if (!user || !data) {
      console.log("Login failed: non existing user -" + user )
      res.redirect('/admin');
    } else if(user === data._id && password === data.password || user === data.user && password === data.password  ) {
      if (data.eofAdmin) {
        // console.log("THIS IS A ADMIN ACCOUNT");
        req.session.admin = true;
      }
      if (data.adminName) {
        // console.log("THIS IS A ADMIN ACCOUNT");
        req.session.adminName = data.adminName;
      }
      req.session.user = user;
      req.session.organisationName = (data.organisationName || data.orgName);
      req.session.organisationEmail = JSON.stringify(data.organisationEmail || data.adminEmail) ;
      req.session._id = JSON.stringify(data._id);
      req.session.licensekey = JSON.stringify(data.licensekey);
      req.session.endDate = JSON.stringify(data.endDate);
      req.session.startDate = JSON.stringify(data.startDate);
      req.session.active = JSON.stringify(data.active);
      req.session.active = JSON.stringify(data.active);

      talkteam_clients.fetch({include_docs:true}, function (err, data) {
        var printUserlist = [];
        var userRows = [];
        data.rows.forEach(function(rows) {
          userRows.push(rows.doc);
        });
        data.rows.forEach(function(user) {
          Object.entries(user).forEach(([key]) => {
            var userKey = key;
            printUserlist.push(userKey);
          });
        });

        req.session.userRows = userRows;
        req.session.userlist = printUserlist;
        res.redirect('/toc');
        delete req.session.userlist;
        console.log("deleted userlist from req.session")
      });
    } else {
      req.session.errorMessage = "Found no user with this password/username combination. Make sure you login with the correct password and username ór email"
      res.redirect('/admin');
      // res.redirect('/toc');
    }
  });
});

//FAQS
app.post('/faqform/post', function(req, res) {
  console.log('MAIL IS SEND WITH :' + req.body.form_organisation , req.body.form_subject , req.body.form_email, req.body.form_question )
  app.mailer.send(
    {
      // from: ''+req.body.adminName+'<'+req.body.form_email+'>',
      from: 'talkteam@e-office.com',
      cc: ''+req.body.adminName+'<'+req.body.form_email+'>',
      template: 'faqmail.html', // REQUIRED
      replyTo: ''+req.body.adminName+'<'+req.body.form_email+'>'
    },
    {
      to: 'e-services@e-office.com',
      subject: req.body.form_subject,
      department: req.body.form_subject,
      organisation: req.body.form_organisation,
      customer: req.body.form_email,
      question: req.body.form_question,
      otherProperty: 'Other Property'
    },
    function (err) {
      if (err) {
        // handle error
        console.log(err);
        res.send('There was an error rendering the email');
        return;
      };
        // mail sent!
        console.log("Data send : ", req.body.form_email );
        res.redirect('/thankyou');
    }
  );
    // res.mailer.render('faqmail.html', {
    //   to: 'mitchell.seedorf@e-office.com',
    //   subject: 'Test Email',
    //   otherProperty: 'Other Property',
    //   title: req.body.form_organisation
    // }, function (err, message) {
    //   if (err) {
    //
    //   }
    //   res.header('Content-Type', 'text/plain');
    //   res.send(message);
    // });
});
app.post('/new/question', function(req, res) {
  // Create a new "talkteam_clients" database.
  var faq = cloudant.db.use('faq');
  var question_section = req.body.question_section;
  var question_title = req.body.question_title;
  var question_answer = req.body.question_answer;
  var question_title_nl = req.body.question_title_nl;
  var question_answer_nl = req.body.question_answer_nl;
  cloudant.db.create('faq', function(err, res) {
    if (err) {
        console.log('Could not create new db: ' + 'faq' + ', it might already exist.');
    }
    faq.insert({
      original_id: req.body.question_title,
      question_title: req.body.question_title,
      question_answer: req.body.question_answer,
      question_title_nl: req.body.question_title_nl,
      question_answer_nl: req.body.question_answer_nl,
      question_section: req.body.question_section
    }, question_title, function(err, body, header) {
      if (err) {
        return console.log('[faq.insert] ', err.message);
      }
      console.log('You have inserted '+ question_title + ' in DB : faq');
    });
  });
  res.redirect('/faq');
});

app.post('/edit/question', function(req, res) {
  var faq = cloudant.db.use('faq');
  var question_section = req.body.question_section;
  var question_title = req.body.question_title;
  var question_title_nl = req.body.question_title_nl;
  var question_old_title = req.body.question_old_title;
  var question_answer = req.body.question_answer;
  var question_answer_nl = req.body.question_answer_nl;
  var question_section = "general";
  var original_id = req.body.original_id;

  faq.get(original_id, function(err, data) {
    if (!err) {
      var rev = data._rev;
      // ...and insert a document in it.
      faq.insert({
        _id: original_id,
        _rev: rev,
        question_title: req.body.blogpost_title,
        question_title_nl: req.body.question_title_nl,
        question_answer_nl: req.body.question_answer_nl,
        question_title: req.body.question_title,
        question_answer: req.body.question_answer,
        question_section: "general",
        original_id: original_id
        // blogpost_file: req.file
      }, original_id, function(err, body, header) {
        if (err) {
          console.log("Faq err finding entry" + original_id);
        } else {
          console.log("GET succes editing entry:"+ original_id);
        }
      });
    } else {
      console.log(err.message)
    }
    res.redirect('/faq');
  });
});
app.post('/delete/question', function(req, res) {
  var faq = cloudant.db.use('faq');
  var question_section = req.body.question_section;
  var question_title = req.body.question_title;
  var question_answer = req.body.question_answer;
  var original_id = req.body.original_id;

  faq.get(original_id, function(err, data) {
    if (!question_title || !question_answer) {
      console.log("Failed finding question: " + question_title + "with the following answer " + question_answer )
      res.redirect('/faq');
    } else if (original_id && data._rev) {
      faq.destroy(original_id, data._rev,  function(err) {
        if (!err) {
          console.log("Successfully deleted doc with title: "+ data.question_title + "with following answer : ", data.question_answer);
          res.redirect('/faq');
        } else {
          console.log("No succes deleting title: "+ data.question_title);
          res.redirect('/faq');
        }
      });
    }
  });
});

//BLOG (NEWS)
app.post('/post/download_files', upload.single('download_file'), function(req, res) {
  var download_files = cloudant.db.use('download_files');
  var file_title = req.body.blogpost_title;
  var file_date = req.body.blogpost_date;
  var file_unique_date = req.body.blogpost_unique_date;
  var file_date_format = req.body.blogpost_date_format;
  var blogpost_file = req.file;
  console.log("UploadFile : ", blogpost_file  );
  console.log("UploadFile : ", req.file.originalname  );
  console.log(req.body.blogpost_unique_date);
  // req.session.filename = req.file.originalname;

  // Create a new "talkteam_clients" database.
  cloudant.db.create('download_files', function(err, res) {
    if (err) {
        console.log('Could not create new db: ' + 'blog' + ', it might already exist.');
    }
    download_files.insert({
      file_title: req.body.blogpost_title,
      file_date: req.body.blogpost_date,
      file_unique_date: req.body.blogpost_unique_date,
      file_date_format: req.body.blogpost_date_format,
      file: req.file,
    }, file_title, function(err, body, header) {
      if (err) {
        return console.log('[downloads.insert] ', err.message);
      }
      console.log('You have inserted '+ file_title + ' in DB : download_files', 'physically uploaded to uploads folder');
    });
  });
  res.redirect('/downloads');

});

//BLOG (NEWS)
app.post('/post/blog_post', upload.single('blogpost_file'), function(req, res) {
  var blog = cloudant.db.use('blog');
  var blogpost_title = req.body.blogpost_title;
  var blogpost_body = req.body.blogpost_body;
  var blogpost_title_nl = req.body.blogpost_title_nl;
  var blogpost_body_nl = req.body.blogpost_body_nl;
  var blogpost_date = req.body.blogpost_date;
  var blogpost_unique_date = req.body.blogpost_unique_date;
  var blogpost_date_format = req.body.blogpost_date_format;
  var blogpost_file = req.file;
  console.log("UploadFile : ", blogpost_file  );
  console.log("UploadFile : ", req.file.originalname  );
  console.log(req.body.blogpost_unique_date);
  // req.session.filename = req.file.originalname;

  // Create a new "talkteam_clients" database.
  cloudant.db.create('blog', function(err, res) {
    if (err) {
        console.log('Could not create new db: ' + 'blog' + ', it might already exist.');
    }
    blog.insert({
      blogpost_title: req.body.blogpost_title,
      blogpost_body: req.body.blogpost_body,
      blogpost_title_nl: req.body.blogpost_title_nl,
      blogpost_body_nl: req.body.blogpost_body_nl,
      blogpost_date: req.body.blogpost_date,
      blogpost_date_format: req.body.blogpost_date_format,
      blogpost_unique_date: req.body.blogpost_unique_date,
      blogpost_file: req.file,
    }, blogpost_title, function(err, body, header) {
      if (err) {
        return console.log('[blog.insert] ', err.message);
      }
      console.log('You have inserted '+ blogpost_title + ' in DB : blog');
    });
  });
  res.redirect('/blog');

});
app.post('/post/blog_edit', upload.single('blogpost_file_edit'), function(req, res) {
  var blog = cloudant.db.use('blog');
  var blogpost_old_title = req.body.blogpost_old_title;
  var blogpost_title = req.body.blogpost_title;
  var blogpost_body = req.body.blogpost_body;
  var blogpost_title_nl = req.body.blogpost_title;
  var blogpost_body_nl = req.body.blogpost_body;
  var blogpost_date = req.body.blogpost_date;
  var blogpost_unique_date = req.body.blogpost_unique_date;
  var blogpost_date_format = req.body.blogpost_date_format;
  var blogpost_id = req.body.blogpost_id;

  if (req.file) {
    console.log(req.file)
    var blogpost_file = req.file;
  }
  console.log('req.body vars : ', req.body)
  console.log('blogpost_date : ', req.body.blogpost_date)
  console.log('blogpost_unique_date : ', req.body.blogpost_unique_date)
  console.log('Old Title : ', req.body.blogpost_old_title)

  blog.get(blogpost_id, function(err, data) {
    if (!err) {
      console.log("GET found 1 entry ! :"+ blogpost_old_title);
      console.log("Data :"+ data);
      var rev = data._rev;
      // ...and insert a document in it.
      blog.insert({
        _id: blogpost_id,
        _rev: rev,
        blogpost_title: req.body.blogpost_title,
        blogpost_body: req.body.blogpost_body,
        blogpost_title_nl: req.body.blogpost_title_nl,
        blogpost_body_nl: req.body.blogpost_body_nl,
        blogpost_date: req.body.blogpost_date,
        blogpost_date_format: req.body.blogpost_date_format,
        blogpost_unique_date: req.body.blogpost_unique_date,
        blogpost_file: req.file,
      }, blogpost_id, function(err, body, header) {
        if (err) {
          console.log("Blog err finding entry : " + blogpost_id);
        } else {
          console.log("GET succes editing entry:"+ blogpost_id);
        }
      });
    } else {
      console.log(err.message)
      console.log("Nothing found, post not inserted")
    }
    console.log("POST used : "+ blog + "\n In language : "+ req.session.lang);
    res.redirect('/blog');
  });

});
app.post('/delete/blog_post', function(req, res) {
  var blog = cloudant.db.use('blog');
  var blogpost_title = req.body.blogpost_title;
  var blogpost_body = req.body.blogpost_body;
  var blogpost_date = req.body.blogpost_date;
  var blogpost_unique_date = req.body.blogpost_unique_date;
  var blogpost_id = req.body.blogpost_id;

  blog.get(blogpost_id, function(err, data) {
    if(data._id == blogpost_id) {
      blog.destroy(blogpost_id, data._rev,  function(err) {
        if (!err) {
          console.log("Successfully deleted doc with title: "+ blogpost_title);
          res.redirect('/blog');

        } else {
          console.log("No succes deleting title: "+ blogpost_id);
          res.redirect('/blog');
        }
      })
    } else {
      res.redirect('/blog');
    }
  });
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
