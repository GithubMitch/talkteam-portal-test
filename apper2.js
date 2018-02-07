/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
    dbName: 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty');
var SuperLogin = require('superlogin');
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// app.use('/', express.static(__dirname + '/www')); // redirect root
// app.use('/api', api); // redirect API calls
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.use('/js', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect jQuery MMenu
app.use('/css', express.static(__dirname + '/node_modules/jquery.mmenu/dist')); // redirect CSS jQuery MMenu

// var request = require('request'),
//     username = "mitchell.seedorf@e-office.com",
//     password = "Onelove#1",
//     url = "http://localhost:3000",
//     auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
//
// request(
//     {
//         url : url,
//         headers : {
//             "Authorization" : auth
//         }
//     },
//     function (error, response, body) {
//         // Do more stuff with 'body' here
//         // console.log(request.username)
//     }
// );


// require('dotenv').load();

// Load the Cloudant library.
var Cloudant = require('cloudant');
var username = "186bc4a1-0187-48b2-bc2d-b54267a7fce2-bluemix";
var password = "5e39c2c9728fc768ab2dc93f26c9eb9a62038517b813ac4ee1454136f3833182";
var cloudant = Cloudant({account:username, password:password});


  // Create a new "alice" database.
  cloudant.db.create('talkTeamRegister', function() {

    // Specify the database we are going to use (alice)...
    var talkTeamRegister = cloudant.db.use('talkTeamRegister')

    // ...and insert a document in it.
    talkTeamRegister.insert({ crazy: true }, 'rabbit', function(err, body, header) {
      if (err) {
        return console.log('[alice.insert] ', err.message);
      }

      console.log('You have inserted the rabbit.');
      console.log(body);
    });
  });

// Remove any existing database called "alice".
// cloudant.db.destroy('alice', function(err) {
//
//   // Create a new "alice" database.
//   cloudant.db.create('alice', function() {
//
//     // Specify the database we are going to use (alice)...
//     var alice = cloudant.db.use('users')
//
//     // ...and insert a document in it.
//     alice.insert({ crazy: true }, 'panda', function(err, body, header) {
//       if (err) {
//         return console.log('[alice.insert] ', err.message);
//       }
//
//       console.log('You have inserted the panda.');
//       console.log(body);
//     });
//   });
// });

http.createServer(app).listen(app.get('port'));




// // development only
// if ('development' == app.get('env')) {
//     app.use(errorHandler());
// }
//
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
// }
//
// initDBConnection();
//
app.get('/', routes.index);
app.get('/register', routes.register);
app.get('/downloads', routes.downloads);
app.get('/news', routes.news);
app.get('/admin', routes.news);
//
// function createResponseData(id, name, value, attachments) {
//
//     var responseData = {
//         id: id,
//         name: sanitizeInput(name),
//         value: sanitizeInput(value),
//         attachements: []
//     };
//
//
//     attachments.forEach(function(item, index) {
//         var attachmentData = {
//             content_type: item.type,
//             key: item.key,
//             url: '/api/favorites/attach?id=' + id + '&key=' + item.key
//         };
//         responseData.attachements.push(attachmentData);
//
//     });
//     return responseData;
// }
//
// function sanitizeInput(str) {
//     return String(str).replace(/&(?!amp;|lt;|gt;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// }
//
// var saveDocument = function(id, name, value, response) {
//
//     if (id === undefined) {
//         // Generated random id
//         id = '';
//     }
//
//     db.insert({
//         name: name,
//         value: value
//     }, id, function(err, doc) {
//         if (err) {
//             console.log(err);
//             response.sendStatus(500);
//         } else
//             response.sendStatus(200);
//         response.end();
//     });
//
// }
//
// app.get('/api/favorites/attach', function(request, response) {
//     var doc = request.query.id;
//     var key = request.query.key;
//
//     db.attachment.get(doc, key, function(err, body) {
//         if (err) {
//             response.status(500);
//             response.setHeader('Content-Type', 'text/plain');
//             response.write('Error: ' + err);
//             response.end();
//             return;
//         }
//
//         response.status(200);
//         response.setHeader("Content-Disposition", 'inline; filename="' + key + '"');
//         response.write(body);
//         response.end();
//         return;
//     });
// });
//
// app.post('/api/favorites/attach', multipartMiddleware, function(request, response) {
//
//     console.log("Upload File Invoked..");
//     console.log('Request: ' + JSON.stringify(request.headers));
//
//     var id;
//
//     db.get(request.query.id, function(err, existingdoc) {
//
//         var isExistingDoc = false;
//         if (!existingdoc) {
//             id = '-1';
//         } else {
//             id = existingdoc.id;
//             isExistingDoc = true;
//         }
//
//         var name = sanitizeInput(request.query.name);
//         var value = sanitizeInput(request.query.value);
//
//         var file = request.files.file;
//         var newPath = './public/uploads/' + file.name;
//
//         var insertAttachment = function(file, id, rev, name, value, response) {
//
//             fs.readFile(file.path, function(err, data) {
//                 if (!err) {
//
//                     if (file) {
//
//                         db.attachment.insert(id, file.name, data, file.type, {
//                             rev: rev
//                         }, function(err, document) {
//                             if (!err) {
//                                 console.log('Attachment saved successfully.. ');
//
//                                 db.get(document.id, function(err, doc) {
//                                     console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));
//
//                                     var attachements = [];
//                                     var attachData;
//                                     for (var attachment in doc._attachments) {
//                                         if (attachment == value) {
//                                             attachData = {
//                                                 "key": attachment,
//                                                 "type": file.type
//                                             };
//                                         } else {
//                                             attachData = {
//                                                 "key": attachment,
//                                                 "type": doc._attachments[attachment]['content_type']
//                                             };
//                                         }
//                                         attachements.push(attachData);
//                                     }
//                                     var responseData = createResponseData(
//                                         id,
//                                         name,
//                                         value,
//                                         attachements);
//                                     console.log('Response after attachment: \n' + JSON.stringify(responseData));
//                                     response.write(JSON.stringify(responseData));
//                                     response.end();
//                                     return;
//                                 });
//                             } else {
//                                 console.log(err);
//                             }
//                         });
//                     }
//                 }
//             });
//         }
//
//         if (!isExistingDoc) {
//             existingdoc = {
//                 name: name,
//                 value: value,
//                 create_date: new Date()
//             };
//
//             // save doc
//             db.insert({
//                 name: name,
//                 value: value
//             }, '', function(err, doc) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//
//                     existingdoc = doc;
//                     console.log("New doc created ..");
//                     console.log(existingdoc);
//                     insertAttachment(file, existingdoc.id, existingdoc.rev, name, value, response);
//
//                 }
//             });
//
//         } else {
//             console.log('Adding attachment to existing doc.');
//             console.log(existingdoc);
//             insertAttachment(file, existingdoc._id, existingdoc._rev, name, value, response);
//         }
//
//     });
//
// });
//
// app.post('/api/favorites', function(request, response) {
//
//     console.log("Create Invoked..");
//     console.log("Name: " + request.body.name);
//     console.log("Value: " + request.body.value);
//
//     // var id = request.body.id;
//     var name = sanitizeInput(request.body.name);
//     var value = sanitizeInput(request.body.value);
//
//     saveDocument(null, name, value, response);
//
// });
//
// app.delete('/api/favorites', function(request, response) {
//
//     console.log("Delete Invoked..");
//     var id = request.query.id;
//     // var rev = request.query.rev; // Rev can be fetched from request. if
//     // needed, send the rev from client
//     console.log("Removing document of ID: " + id);
//     console.log('Request Query: ' + JSON.stringify(request.query));
//
//     db.get(id, {
//         revs_info: true
//     }, function(err, doc) {
//         if (!err) {
//             db.destroy(doc._id, doc._rev, function(err, res) {
//                 // Handle response
//                 if (err) {
//                     console.log(err);
//                     response.sendStatus(500);
//                 } else {
//                     response.sendStatus(200);
//                 }
//             });
//         }
//     });
//
// });
//
// app.put('/api/favorites', function(request, response) {
//
//     console.log("Update Invoked..");
//
//     var id = request.body.id;
//     var name = sanitizeInput(request.body.name);
//     var value = sanitizeInput(request.body.value);
//
//     console.log("ID: " + id);
//
//     db.get(id, {
//         revs_info: true
//     }, function(err, doc) {
//         if (!err) {
//             console.log(doc);
//             doc.name = name;
//             doc.value = value;
//             db.insert(doc, doc.id, function(err, doc) {
//                 if (err) {
//                     console.log('Error inserting data\n' + err);
//                     return 500;
//                 }
//                 return 200;
//             });
//         }
//     });
// });
//
// app.get('/api/favorites', function(request, response) {
//
//     console.log("Get method invoked.. ")
//
//     db = cloudant.use(dbCredentials.dbName);
//     var docList = [];
//     var i = 0;
//     db.list(function(err, body) {
//         if (!err) {
//             var len = body.rows.length;
//             console.log('total # of docs -> ' + len);
//             if (len == 0) {
//                 // push sample data
//                 // save doc
//                 var docName = 'sample_doc';
//                 var docDesc = 'A sample Document';
//                 db.insert({
//                     name: docName,
//                     value: 'A sample Document'
//                 }, '', function(err, doc) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//
//                         console.log('Document : ' + JSON.stringify(doc));
//                         var responseData = createResponseData(
//                             doc.id,
//                             docName,
//                             docDesc, []);
//                         docList.push(responseData);
//                         response.write(JSON.stringify(docList));
//                         console.log(JSON.stringify(docList));
//                         console.log('ending response...');
//                         response.end();
//                     }
//                 });
//             } else {
//
//                 body.rows.forEach(function(document) {
//
//                     db.get(document.id, {
//                         revs_info: true
//                     }, function(err, doc) {
//                         if (!err) {
//                             if (doc['_attachments']) {
//
//                                 var attachments = [];
//                                 for (var attribute in doc['_attachments']) {
//
//                                     if (doc['_attachments'][attribute] && doc['_attachments'][attribute]['content_type']) {
//                                         attachments.push({
//                                             "key": attribute,
//                                             "type": doc['_attachments'][attribute]['content_type']
//                                         });
//                                     }
//                                     console.log(attribute + ": " + JSON.stringify(doc['_attachments'][attribute]));
//                                 }
//                                 var responseData = createResponseData(
//                                     doc._id,
//                                     doc.name,
//                                     doc.value,
//                                     attachments);
//
//                             } else {
//                                 var responseData = createResponseData(
//                                     doc._id,
//                                     doc.name,
//                                     doc.value, []);
//                             }
//
//                             docList.push(responseData);
//                             i++;
//                             if (i >= len) {
//                                 response.write(JSON.stringify(docList));
//                                 console.log('ending response...');
//                                 response.end();
//                             }
//                         } else {
//                             console.log(err);
//                         }
//                     });
//
//                 });
//             }
//
//         } else {
//             console.log(err);
//         }
//     });
//
// });
//
//
// http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
//     console.log('Express server listening on port ' + app.get('port'));
// });