
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'Talkteam Portal' });
};
exports.register = function(req, res){
  res.render('register.html', { title: 'Talkteam - Register page' });
};
exports.downloads = function(req, res){
  res.render('downloads.html', { title: 'Talkteam - Downloads & Releases page' });
};
exports.news = function(req, res){
  res.render('news.html', { title: 'Talkteam - News & Updates page' });
};
exports.thankyou = function(req, res){
  res.render('thankyou.html', { title: 'Talkteam - Thankyou page' });
};
exports.admin = function(req, res){
  res.render('admin.html', { title: 'Talkteam - Admin' });
};
exports.login = function(req, res){
  res.render('login.html', { title: 'Talkteam - login' });
};
exports.logout = function(req, res){
  res.render('logout.html', { title: 'Talkteam - logout' });
};
exports.content = function(req, res){
  res.render('content.html', { title: 'Talkteam - content' });
};
