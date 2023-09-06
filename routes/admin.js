var express = require('express');

var router = express.Router();


router.get('/',  (req, res) =>{
    res.render('index', { title:'ADMIN PAGE' ,action:'Admin Page',formaciton:'/admin'  , nextLogin:'/users', nextLoginmsg:'Go to user login',});
})




router.post('/',  (req, res) =>{
    // const { username, password } = req.body;
      
    //   // Validate admin credentials (compare with database)
    //   if (isValidAdmin(username, password)) {
    //       // Admin login successful, set session/cookie and redirect
    //       req.session.isAdmin = true;
    //       res.redirect('/admin/dashboard');
    //   } else {
    //       // Admin login failed, display error message
    //       res.render('admin-login', { error: 'Invalid credentials' });
    //   }
      
    res.send(req.body)
  }
  )

  module.exports = router;