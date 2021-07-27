const  logger = require('../config/logger').authLogger;

const checkAuthenticated = (req,res,next)=>{
    try {
        logger.info("In checkAuthenticated")
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/user/login');
    } catch (error) {
        logger.error("Error in checkAuthenticated: ",error.toString())
    }

}
const checkNotAuthenticated = (req,res,next)=>{
    try {
        logger.info("In checkNotAuthenticated")
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        return next();
    } catch (error) {
        logger.error("Error in checkNotAuthenticated: ",error.toString())
    }

}
module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}