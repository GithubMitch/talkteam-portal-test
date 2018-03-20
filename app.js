/**
 * Module dependencies.
 */

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
    authorization = require('express-authorization'),
    createElement = require('create-element'),
    babelPolyfill = require("babel-polyfill"),
    mailer = require('express-mailer'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    errorHandler = require('errorhandler'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    SuperLogin = require('superlogin');

var app = express(),
    db,
    cloudant,
    fileToUpload,
    currentURL;

var dbCredentials = {
    dbName: 'my_sample_db'
};

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
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use('/lib', express.static(__dirname + '/node_modules/domjson/dist')); // redirect domJSON JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/babel-polyfill/dist')); // redirect JS Polyfill
app.use('/js', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect jQuery MMenu
app.use('/css', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect CSS jQuery MMenu
// BLOG INSTANCE + MAPPING
// app.use('/blog',express.static(path.join(__dirname, 'app_blog/build'))); //blog INSTANCE
// app.use('/css', express.static(__dirname + '/app_blog/build/css')); // redirect CSS blog css

app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

///ROUTES
app.get('/', routes.index);
app.get('/home', routes.index);
app.get('/register', routes.register);
app.get('/downloads', routes.downloads);
app.get('/news', routes.news);
app.get('/admin', routes.admin);
app.get('/thankyou', routes.thankyou);
app.get('/login', routes.login);
app.get('/content', routes.content);
app.get('/toc', routes.toc);
app.get('/faq', routes.faq);
app.get('/logout', routes.logout);
app.get('/blog', routes.blog);

//MAILTEMPLATING
mailer.extend(app, {
  from: 'no-reply@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'mseedorf2018@gmail.com',
    pass: 'onelove1'
  }
});

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//TEST DB
// var Cloudant = require('cloudant');
// var username = "186bc4a1-0187-48b2-bc2d-b54267a7fce2-bluemix";
// var password = "5e39c2c9728fc768ab2dc93f26c9eb9a62038517b813ac4ee1454136f3833182";
// var cloudant = Cloudant({account:username, password:password});

//REAL TALKTEAM DATABASE
var Cloudant = require('cloudant');
var username = "df3909e9-2680-472f-9deb-9638cf73c572-bluemix";
var password = "6b0a6bfddb9da34d09680a00a78eecb14a4724bf99e2e426f0730ab5ebdf9cd7";
var cloudant = Cloudant({account:username, password:password});

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

        console.log('You have registered user '+ regUser + ' in DB : talkteam_clients');
        console.log(body);
      });

    });
    res.redirect('/thankyou');
});

// Login endpoint
app.post('/login', function (req, res) {
  var user = req.body.username;
  var password = req.body.password;
  var talkteam_clients = cloudant.db.use('talkteam_clients');
  console.log(user);

  talkteam_clients.get(req.body.username, function(err, body) {
    if (!err) {
      console.log("Found this profile:")
      console.log(body.organisationName)
      console.log(body.organisationEmail)
      console.log(body._id)
      console.log(body.licensekey)
      console.log(body.endDate)
      console.log(body.active)
    } else {
      console.log(err);
    }
  });
  talkteam_clients.get(user, function(err, data) {
    if (!user || !data) {
      console.log("Login failed: non existing user -" + user )
      res.redirect('/login');
    } else if(user === data._id || password === data.password) {
      if (data.adminName) {
        console.log("THIS IS A ADMIN ACCOUNT")
        req.session.admin = true;
      }
      req.session.user = user;
      req.session.organisationName = (data.organisationName || data.orgName);
      req.session.organisationEmail = JSON.stringify(data.organisationEmail || data.adminEmail) ;
      req.session._id = JSON.stringify(data._id);
      req.session.licensekey = JSON.stringify(data.licensekey);
      req.session.endDate = JSON.stringify(data.endDate);
      req.session.startDate = JSON.stringify(data.startDate);
      req.session.active = JSON.stringify(data.active);
      console.log('Username:' + data._id + '\n' + 'Password:'+ data.password);
      console.log('is now logged in');

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
        console.log(printUserlist);
        res.redirect('/toc');
        delete req.session.userlist;
        console.log("deleted userlist from req.session")
      });
    }
  });

});
app.post('/faqform/post', function(req, res) {
  console.log('MAIL IS SEND WITH :' + req.body.form_organisation , req.body.form_subject , req.body.form_email, req.body.form_question )
  app.mailer.send(
    {
      template: 'faqmail.html', // REQUIRED
      from: req.body.form_email
    },
    {
      to: 'm.seedorf@live.nl',
      subject: "Question @ " + req.body.form_subject,
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
app.post('/admin_cm/post', function(req, res) {
  console.log("ADMIN POST - TOOK PLACE IN /ADMIN/POST ----> ROUTING FROM THIS PATH", req.url);

    var json = req.body._jsonParser;
    var currentPage = req.body.currentPageVar;

    req.session._jsonConverter = json;
    console.log(req.session.lang + " = REQ.SES.LANG BEFORE INSERT")
    if (req.session.lang == 'nl') {
      req.session.lang = 'nl'
      console.log('currentURL = ', req.url);
      console.log('Language set  =  NL / Dutch');
      var admin_db = cloudant.db.use('admin_db_nl');
    } else {
      req.session.lang = 'en'
      console.log('currentURL = ', req.url);
      console.log('Language set  =  Default - EN / English');
      var admin_db = cloudant.db.use('admin_db');
    }


    admin_db.get(currentPage, function(err, doc) {
      if (!err) {
        console.log("GET found 1 entry:"+ currentPage);
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
      console.log("req.session._jsonConverter",req.session._jsonConverter);
      res.redirect('/'+currentPage);
  });
});
app.post('/post/blog_post', function(req, res) {
  var blog = cloudant.db.use('blog');
  var blogpost_title = req.body.blogpost_title;
  var blogpost_body = req.body.blogpost_body;
  var blogpost_date = req.body.blogpost_date;

  console.log(req.body.blogpost_title);

  // Create a new "talkteam_clients" database.
  cloudant.db.create('blog', function(err, res) {
    if (err) {
        console.log('Could not create new db: ' + 'blog' + ', it might already exist.');
    }

    // Specify the database we are going to use (alice)...

    // ...and insert a document in it.
    blog.insert({
      blogpost_title: req.body.blogpost_title,
      blogpost_body: req.body.blogpost_body,
      blogpost_date: req.body.blogpost_date
    }, blogpost_title, function(err, body, header) {
      if (err) {
        return console.log('[blog.insert] ', err.message);
      }

      console.log('You have inserted '+ blogpost_title + ' in DB : blog');
      console.log(body);
    });

  });


  if (req.session.admin) {
    console.log("THIS IS A ADMIN ACCOUNT");
  } else {
    console.log("This is NOT a admin account");
    res.redirect('/blog');
  }

});
app.post('/delete/blog_post', function(req, res) {
  var blog = cloudant.db.use('blog');
  var blogpost_title = req.body.blogpost_title;
  var blogpost_body = req.body.blogpost_body;
  var blogpost_date = req.body.blogpost_date;

  console.log(req.body.blogpost_title);

  blog.get(req.body.blogpost_title, function(err, data) {
    if (!blogpost_title || !blogpost_date) {
      console.log("Failed finding: " + blogpost_title + "with the following date" + blogpost_date )
      res.redirect('/blog');
    } else if(blogpost_title === data.blogpost_date || blogpost_date === data.blogpost_date) {
      console.log("FOUND DATA",data.blogpost_date)
      console.log(data._rev);
      blog.destroy(blogpost_title, data._rev,  function(err) {
        if (!err) {
          console.log("Successfully deleted doc with title: "+ blogpost_title);
          res.redirect('/blog');

        } else {
          console.log("No succes deleting title: "+ blogpost_title);
          res.redirect('/blog');
        }
      });
    }
  });

  // if (req.session.admin) {
  //   console.log("THIS IS A ADMIN ACCOUNT");
  // } else {
  //   console.log("This is NOT a admin account");
  //   res.redirect('/blog');
  // }

});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
