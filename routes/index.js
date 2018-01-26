
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
