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
    mailer = require('express-mailer');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

var currentURL;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var SuperLogin = require('superlogin');



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

// app.use('/', express.static(__dirname + '/www')); // redirect root
// app.use('/api', api); // redirect API calls

app.use(express.static(path.join(__dirname, '/node_modules')));
app.use('/lib', express.static(__dirname + '/node_modules/domjson/dist')); // redirect domJSON JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/babel-polyfill/dist')); // redirect JS Polyfill

app.use('/js', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect jQuery MMenu
app.use('/css', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect CSS jQuery MMenu

app.use(session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

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

// app.get('/restricted',
//   authorization.ensureRequest.isPermitted("restricted:view"),
//   function(req, res) {
//     console.log(' /restriced')
//   });

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
    // return newUser
});

// function getDBCredentialsUrl(jsonData) {
//     var vcapServices = JSON.parse(jsonData);
//     // Pattern match to find the first instance of a Cloudant service in
//     // VCAP_SERVICES. If you know your service key, you can access the
//     // service credentials directly by using the vcapServices object.
//     for (var vcapService in vcapServices) {
//         if (vcapService.match(/cloudant/i)) {
//             return vcapServices[vcapService][0].credentials.url;
//         }
//     }
//     consol.log('Done')
// }
//
// function initDBConnection() {
//     //When running on Bluemix, this variable will be set to a json object
//     //containing all the service credentials of all the bound services
//     if (process.env.VCAP_SERVICES) {
//         dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
//     } else { //When running locally, the VCAP_SERVICES will not be set
//
//         // When running this app locally you can get your Cloudant credentials
//         // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
//         // Variables section for an app in the Bluemix console dashboard).
//         // Once you have the credentials, paste them into a file called vcap-local.json.
//         // Alternately you could point to a local database here instead of a
//         // Bluemix service.
//         // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
//         dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
//     }
//
//     cloudant = require('cloudant')(dbCredentials.url);
//
//     // check if DB exists if not create
//     cloudant.db.create(dbCredentials.dbName, function(err, res) {
//         if (err) {
//             console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
//         }
//     });
//
//     db = cloudant.use(dbCredentials.dbName);
//
//
// }
// initDBConnection();
// function createResponseData(id, name, value, attachments) {
//
//

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
      console.log("Error _GET req.body.username : " + body);
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
      req.session.organisationEmail = JSON.stringify(data.organisationEmail) ;
      req.session._id = JSON.stringify(data._id);
      req.session.licensekey = JSON.stringify(data.licensekey);
      req.session.endDate = JSON.stringify(data.endDate);
      req.session.startDate = JSON.stringify(data.startDate);
      req.session.active = JSON.stringify(data.active);
      console.log('Username:' + data._id + '\n' + 'Password:'+ data.password);
      console.log('is now logged in');
      console.log(req.session.licensekey);


      talkteam_clients.fetch({include_docs:true}, function (err, data) {

        var printUserlist = [];
        var userRows = [];
        data.rows.forEach(function(rows) {
          // console.log(rows.doc);
          userRows.push(rows.doc);
        });
        data.rows.forEach(function(user) {
          Object.entries(user).forEach(([key]) => {
            var userKey = key;
            // console.log(userKey);
            printUserlist.push(userKey);
          });
        });
        // console.log(userRows);
        // console.log(printUserlist)

        req.session.userRows = userRows;
        req.session.userlist = printUserlist;
        console.log(printUserlist);
        res.redirect('/toc');
        delete req.session.userlist;
        console.log("deleted userlist from req.session")
      });

      // res.render('/content.html', { username: req.session.user });
    }
  });

});

// app.post('/', function(req, res) {
//     var json = req.body._jsonParser;
//     var currentPage = req.body.currentPageVar;
//
//     req.session._jsonConverter = json;
//
//     var admin_db = cloudant.db.use('admin_db');
//
//     admin_db.get(currentPage, function(err, doc) {
//       if (!err) {
//         console.log("GET found 1 entry:"+ currentPage);
//         var rev = doc._rev;
//         // ...and insert a document in it.
//         admin_db.insert({
//           _id: currentPage,
//           _rev: rev,
//           reqContent: json
//         }, currentPage, function(err, body, header) {
//           if (err) {
//             console.log("Admin_db err");
//           } else {
//             console.log("GET succes finding entry:"+ currentPage);
//           }
//         });
//         console.log("retreived doc : \n" + doc);
//       };
//       console.log("JSON STRING : \n" + json);
//       res.redirect('/');
//   });
// // });

// app.post('/lang/post', function(req, res) {
//   delete req.session.lang;
//   res.redirect('/'+currentPage+);
// });
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
        // console.log("retreived doc : \n" + doc);
      };
      console.log("POST used : "+ admin_db + "\nIn language : "+ req.session.lang);
      delete req.session._jsonConverter;
      console.log("req.session._jsonConverter",req.session._jsonConverter);
      // console.log("JSON STRING : \n" + json);
      res.redirect('/'+currentPage);
  });
});

// Logout endpoint
// app.get('/logout', function (req, res) {
//   req.session.destroy();
//   // res.send("logout success!");
//   console.log("Logout succesfull");
//   res.redirect('/content');
// });

// Get content endpoint
// app.get('/content', auth, function (req, res) {
//     // res.send("You can only see this after you've logged in.");
//     // res.redirect('/content');
//     res.sendFile('./views/content.html', {
//       root: __dirname,
//       username: req.session.username
//     });
//
// });

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
