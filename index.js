const { urlencoded } = require('express')
const express = require('express')
const app = express()
const bcrypt= require('bcrypt')
const passport= require('passport')
const flash= require('express-flash')
const session=require('express-session')
const auth = require('./middlewares/auth')
const routes= require('./routes/index')
const logger = require('./config/logger').mainLogger;
const expressLayouts  = require('express-ejs-layouts');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

/**Configuring DB */
const db = require('./config/db')

db.authenticate().then(()=>{
    logger.info('DB Connection has been established successfully.');
}).catch((err)=>{
    logger.error(err.toString());
})

/**Passport config */
const passportInit = require('./config/passport')
passportInit(passport);

app.use(express.static(__dirname + '/public'));
app.use('/user',express.static(__dirname+'public/'))



app.use(expressLayouts)
app.set('layout', './layouts/full-width.ejs')
app.set('view-engine','ejs')

app.use(urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false    

}))




app.use(passport.initialize())
app.use(passport.session())
app.use(routes(this.app,passport))


app.listen(3000,()=>{
    console.log("Server Listening to port 3000")
})

