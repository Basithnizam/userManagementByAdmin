//SignUp Page

var express = require('express');
var router = express.Router();

//importing mongodb connection function
let {dB1} = require('./connectingToMongo')

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds (higher is more secure)



router.get('/',(req, res)=>{
  res.redirect('/users')
});




router.post('/signup', async (req, res) => {
  try {
    let db = await dB1();
    let connection = await db.collection('users');

    // Check if the username already exists in the database
    const existingUser = await connection.findOne({ username: req.body.username });

    if (existingUser) {
      // Username already exists, return an error message or redirect to signup page
      res.render('signup', { title: 'SignUp', action: 'Signup page', incorrect: 'This email is already registered' });
    } else {
      // Username doesn't exist, proceed with password hashing and insertion
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword; // Update the password field with the hashed password

      await connection.insertOne(req.body);
      res.render('home', { title: 'Successfully signed up', action: 'SignUp', button: 'LogIn' });
      console.log('Insertion worked');
    }
  } catch (error) {
    console.error('Error in /signup:', error);
    res.status(500).send('Internal Server Error');
  }
});



router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      console.log("Session destroyed");
      res.redirect('/'); // Redirect to the login page or any other appropriate page
    }
  });
});





//SignUp page
router.get('/signup',(req, res)=>{
  res.render('signup', {title:'SignUp', action:'Signup page' }) 
});




module.exports = router;
