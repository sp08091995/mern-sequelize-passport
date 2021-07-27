module.exports = function(app, passport) {
    const mainroute = require('express').Router()
    const auth = require('../middlewares/auth')
  
    /* ---- other existing routes included ---- */
    const r_user = require('./user/index'); /*my custom route*/
  
    /* ---- all other routes ---- */
    mainroute.use('/user', r_user(app, passport)); /*my custom route*/
  
    mainroute.get('/', auth.checkAuthenticated,function(req, res) {
      res.render('index.ejs',{name: "santa"});
    });
  
    return mainroute;
  };