const User = require('../Models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');

module.exports.logout = (req, res, next) => {
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success', 'You are logged Out!');
    res.redirect('/listing');
  } );
}

module.exports.renderSignupForm = (req, res) => {
  res.render('./users/signup.ejs');
}

module.exports.renderLoginForm = (req, res) => {
  res.render('./users/login.ejs');
}

module.exports.login = async(req, res)=> {
  req.flash('success', 'Welcome back to StayNest!');
  let redirectUrl = res.locals.redirectUrl || '/listing' ;
  res.redirect(redirectUrl);
}

module.exports.signup = wrapAsync(async (req, res) => {
  try{
    let{ username , email, password } = req.body;
    const newUser = new User({username, email})
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
      req.flash('success', 'welcome to StayNest!');
      res.redirect('/listing');
    })
  }catch(e){
    req.flash('error', e.message);
    res.redirect('/signup');
  }

})