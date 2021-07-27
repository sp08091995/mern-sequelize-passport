const  logger = require('../config/logger').passportLogger
const LocalStrategy =  require('passport-local').Strategy
const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = function initialize(passport,getUserByEmail,getUserById){
    logger.info("In initialize")
    passport.use(new LocalStrategy({ usernameField: 'email'},async (email,password,done)=>{
        const user= await User.findByCredentials(email,password)
        console.log(user)
        if(user==null){
            return done(null,false,{message: "Unable to authenticate"})
        }
        try {
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false,{message: "Unable to authenticate"})
            }
        } catch (error) {
            logger.error("Error in initialize: "+error.toString())
            return done(error);
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        done(null,User.findById(id))
    })
    logger.info("Completed initialize")

}