// index.js
// WIP making CRUD

var REST_DATA = 'api/register';



function registerForm() {
  var registerButton = document.createElement('div');
  var userForm = document.getElementById('regForm');
  userForm.append(registerButton)
  if (userForm) {
    registerButton.innerHTML = "<input width=\"100\" type=\"submit\" onClick='registerUser(this)'>";
    console.log("Found userForm");
  }
};


function registerUser() {
  console.log("registerUser fired");
};


registerForm();
