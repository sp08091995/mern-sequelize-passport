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
    
    router.post('/register',auth.checkNotAuthenticated, async (req,res) => {
        try {
            let {username,firstname, lastname, email, password, password2} =req.body;
            console.log(req.body)
            const user = User.build({
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                
            })  
            const result = await user.save();
            logger.info(user)
            logger.info("User Registered")
            res.redirect('/user/login')
            console.log(user)
        } catch (error) {
            logger.error("Error in post /register",error.toString())
            res.redirect('/user/register')
            
            
        }
    })
    router.delete('/logout',(req,res)=>{
        req.logOut();
        res.redirect('/')
    })
  
    return router;
  };
  