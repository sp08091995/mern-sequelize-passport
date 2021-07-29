module.exports = function(app, passport) {
    const mainroute = require('express').Router()
    const auth = require('../middlewares/auth')
    const logger = require('../config/logger').mainLogger;
  
    /* ---- other existing routes included ---- */
    const r_user = require('./user/index'); /*my custom route*/
  
    /* ---- all other routes ---- */
    mainroute.use('/user', r_user(app, passport)); /*my custom route*/
  
    mainroute.get('/', auth.checkAuthenticated,async function(req, res) {
      try {
        const loggedUser = await req.user
        console.log(loggedUser)
        logger.info(JSON.stringify(loggedUser))
        res.render('index.ejs',{user: loggedUser,title: "Home Page"});
      } catch (error) {
        logger.info(error.toString())
      }
    });
  
    return mainroute;
  };