var express = require('express');
var router = express.Router();

//importing connecitingToMongo
let {dB1} = require('./connectingToMongo');
//declaring variable to make it avilable globally
let uppercaseName1, uppercaseName2;

//function to check the session 
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next('route'); 
  }
}
//validating and creating session
router.post('/', async function (req, res) {
  try {
    let db = await dB1();
    let collection = db.collection('users');

    // Wait for both database queries to complete and store their results
    let username1 = await collection.findOne({ username: req.body.username }, { username: 1, _id: 0 });
    let password1 = await collection.findOne({ username: req.body.username }, { password: 1, _id: 0 });
    const { username, password } = req.body;
    
  
    if(!username1) { // 
      res.render('index', { title: 'Login' ,action:'Login page',formaciton:'/users'  , nextLogin:'/admin',nextLoginmsg:'Login as Admin',newuser:'NEW USERS?  or ', btnaciton:'SignUp',incorrect:'User not registered'})
    }else if(( username ===username1.username) && ( password !== password1.password)){
      res.render('index', { title: 'Login' ,action:'Login page',formaciton:'/users'  , nextLogin:'/admin',nextLoginmsg:'Login as Admin',newuser:'NEW USERS?  or ', btnaciton:'SignUp',incorrect:'Invalid password'}) 
      
    }else if(( username ===username1.username) && ( password === password1.password)){
    req.session.user = username; 
    let name1 = username1.firstname;
    let name2= username1.lastname;
    uppercaseName1 = name1.toUpperCase();
    uppercaseName2 = name2.toUpperCase();

    res.redirect('/')

   }else{
    
    res.render('index', { title: 'Login' ,action:'Login page',formaciton:'/users'  , nextLogin:'/admin',nextLoginmsg:'Login as Admin',newuser:'NEW USERS?  or ', btnaciton:'SignUp',incorrect:'Incorrect credintial'})
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
