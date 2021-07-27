module.exports = function(app, passport) {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt')
    const auth = require('../../middlewares/auth')
    const db = require('../../config/db')
    const User = require('../../models/User')
    const logger = require('../../config/logger').userLogger

    router.get('/', auth.checkAuthenticated ,(req,res) => {
        res.render('index.ejs',{name: "santa"})
    })
    
    router.get('/login',auth.checkNotAuthenticated,(req,res) => {
        res.render('login.ejs',{name: "santa"})
    })

    router.post('/login', auth.checkNotAuthenticated ,passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    }))
    
    
    
    router.get('/register',auth.checkNotAuthenticated,(req,res) => {
        res.render('register.ejs',{name: "santa"})
    })

    router.get('/allUsers',async (req,res) => {
        try {
            const users= await User.getAllUsers();
            logger.info(JSON.stringify(users))
            console.log(JSON.stringify(users))
            res.render('table.ejs',{users})
        } catch (error) {
            logger.error(error.toString())
        }
        
    })
    
    router.post('/register',auth.checkNotAuthenticated, async (req,res) => {
        try {
            let errors=[]
            let {username,firstname, lastname, email, password, password2} =req.body;
            /**Validations */
            if(!username || !firstname || !lastname || !password ||!email || !password2){
                errors.push({message : "Please enter all fields"})
            }
            if(password.length < 6){
                errors.push({message : "Password should be 6 characters"})
                logger.error("Password is not 6 characters")
            }
            try{
                const hasUser = await User.findOne({where : {email: email}})
                if (hasUser){
                    errors.push({message : "Email already Registered"})
                    logger.error("Email already Registered: "+ JSON.stringify(hasUser.toJSON()));
                }
            }catch(err){
                logger.error(err.toString())
            }
            try{
                const hasUser = await User.findOne({where : {username}})
                if (hasUser){
                    errors.push({message : "Username already Registered"})
                    logger.error("Username already Registered: "+JSON.stringify(hasUser.toJSON()));
                }
            }catch(err){
                logger.error(err.toString())
            }
            if(errors.length > 0){
                res.status(422).send(errors)
            }else{
                try {
                    
                    const user = User.build({
                        username: username,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: password,
                        
                    })  
                    logger.info("Saving user: "+JSON.stringify(user.toJSON()))
                    const result = await user.save();
                    if(!result){
                        logger.error("Error while Saving user: ",result)
                        res.status(422).send(errors.push({message : "Unable to save User"}))
                    }
                    logger.info("User Registered")
                    res.user = req.user
                    res.redirect('/user/login')
                } catch (error) {
                    logger.error("Error while Saving user: "+error.toString())
                }
            }
        } catch (error) {
            logger.error("Error in post /register: "+error.toString())
            res.redirect('/user/register')
            
            
        }
    })
    router.post('/logout',(req,res)=>{
        req.logOut();
        res.redirect('/')
    })
  
    return router;
  };
  