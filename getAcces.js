fs = require('fs');

var dbCredentials = {
    dbName: 'cloudantNoSQLDB'
};
var smtpUser = {
  user: 'talkteam@e-office.com',
  pass: 'Mitch3991!'
}
function getDBCredentialsUrl(jsonData) {
    var vcapServices = JSON.parse(jsonData);
    // Pattern match to find the first instance of a Cloudant service in
    // VCAP_SERVICES. If you know your service key, you can access the
    // service credentials directly by using the vcapServices object.
    // Set credentials in dbCredentials
    dbCredentials.username = vcapServices.cloudantNoSQLDB[0].credentials.username;
    dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
    dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
    dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;

    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
    // console.log(vcapServices[vcapService][0].credentials.url)
    console.log('Done');
}
module.exports = {
  smtpUser: smtpUser,
  dbCredentials: dbCredentials,
  initDBConnection: function() {
      //When running on Bluemix, this variable will be set to a json object
      //containing all the service credentials of all the bound services
      if (process.env.VCAP_SERVICES) {
          dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
      } else {
         //When running locally, the VCAP_SERVICES will not be set
          // When running this app locally you can get your Cloudant credentials
          // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
          // Variables section for an app in the Bluemix console dashboard).
          // Once you have the credentials, paste them into a file called vcap-local.json.
          // Alternately you could point to a local database here instead of a
          // Bluemix service.
          // url will be in this format: https://username:password@xxxxxxxxx-bluemix.cloudant.com
          dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("vcap-local.json", "utf-8"));
      }

      // check if DB exists if not create
  },
  dbCredentials
}
