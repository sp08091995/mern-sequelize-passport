const { urlencoded } = require('express')
const express = require('express')
const app = express()
const bcrypt= require('bcrypt')
const passport= require('passport')
const flash= require('express-flash')
const session=require('express-session')
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const users = [];

const passportInit = require('./config/passport')
passportInit(passport,
    email=>users.find(user=> user.email === email),
    id=>users.find(user=> user.id === id)
);



app.set('view-engine','ejs')
app.use(urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false    

}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res) => {
    res.render('index.ejs',{name: "santa"})
})

app.get('/login',(req,res) => {
    res.render('login.ejs',{name: "santa"})
})

app.post('/login',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',(req,res) => {
    res.render('register.ejs',{name: "santa"})
})

app.post('/register',async(req,res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPwd
        })
        res.redirect('login')
        console.log(users)
    } catch (error) {
        res.redirect('register')
        
        
    }
})


app.listen(3000,()=>{
    console.log("Server Listening to port 3000")
})

