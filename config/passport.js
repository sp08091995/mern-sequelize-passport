const LocalStrategy =  require('passport-local').Strategy
const bcrypt= require('bcrypt')

module.exports = function initialize(passport,getUserByEmail,getUserById){
    passport.use(new LocalStrategy({ usernameField: 'email'},async (email,password,done)=>{
        const user= await getUserByEmail(email)
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
            return done(e);
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        done(null,getUserById(id))
    })

}