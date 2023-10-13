var express = require('express');
var router = express.Router();

//importing connecitingToMongo
let {dB1} = require('./connectingToMongo');
//declaring variable to make it avilable globeally
const bcrypt = require('bcrypt');

let uppercaseName1, uppercaseName2;

//function to check the session 
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next('route'); 
  }
}
//validating user  and creating session
router.post('/', async function (req, res) {
  try {
    let db = await dB1();
    let collection = db.collection('users');

    // Wait for both database queries to complete and store their results
    let user = await collection.findOne({ username: req.body.username });
    const { username, password } = req.body;

    if (!user) {
      // User not registered
      res.render('index', {
        title: 'Login',
        action: 'Login page',
        formAction: '/users',
        nextLogin: '/admin',
        nextLoginmsg: 'Login as Admin',
        newuser: 'NEW USERS?  or ',
        btnAction: 'SignUp',
        incorrect: 'User not registered'
      });
    } else {
      // User found, compare hashed passwords
      const hashedPassword = user.password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Passwords match, set user session and redirect
        req.session.user = username;
        let name1 = user.firstname;
        let name2 = user.lastname;
        uppercaseName1 = name1.toUpperCase();
        uppercaseName2 = name2.toUpperCase();
        res.redirect('/');
      } else {
        // Invalid password
        res.render('index', {
          title: 'Login',
          action: 'Login page',
          formAction: '/users',
          nextLogin: '/admin',
          nextLoginmsg: 'Login as Admin',
          newuser: 'NEW USERS?  or ',
          btnAction: 'SignUp',
          incorrect: 'Invalid password'
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});






router.get('/',isAuthenticated,(req,res)=>{
  res.render('home',{ title: uppercaseName1,action:'HOME PAGE',welcome: `WELCOME ${uppercaseName1} ${uppercaseName2}` ,button:'LogOut'})
})

router.get('/',(req, res, )=> {
  res.render('index', { title: 'Login' ,action:'Login page',formaciton:'/users'  , nextLogin:'/admin',nextLoginmsg:'Login as Admin',newuser:'NEW USERS?  or ', btnaciton:'SignUp'});
})


 










module.exports = router;
