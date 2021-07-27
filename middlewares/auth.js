const checkAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/login');

}
const checkNotAuthenticated = (req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return next();

}
module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}