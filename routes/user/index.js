module.exports = function(app, passport) {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt')
    const auth = require('../../middlewares/auth')

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
    
    router.post('/register',auth.checkNotAuthenticated,async(req,res) => {
        try {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPwd
            })
            res.redirect('/user/login')
            console.log(users)
        } catch (error) {
            res.redirect('/user/register')
            
            
        }
    })
    router.delete('/logout',(req,res)=>{
        req.logOut();
        res.redirect('/')
    })
  
    return router;
  };
  