var express = require('express');
var router = express.Router();
let { dB1 } = require('./connectingToMongo');
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB for using Object id

const bcrypt = require('bcrypt');



let uppercaseName1

function isAdmin(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        next('route')
    }

}
//To update existing user


router.post('/updateUser/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    try {
        const db = await dB1();
        const collection = db.collection('users');

        // Check if the new username already exists in the database
        const existingUser = await collection.findOne({ username: updatedUserData.username });

        if (existingUser && existingUser._id.toString() !== userId) {
            // There is already a 0000000000000 User with same username
            return res.status(400).send('Username is already taken');
        } else {

            // Update the user's information based on the user's ID
            await collection.updateOne({ _id: new ObjectId(userId) }, { $set: updatedUserData });
            res.redirect('/admin/findusers');
        }

    } catch (error) {
        console.error('Error in updating user:', error);
        res.status(500).send('Internal Server Error')
    }
});













//fectch and render to edit data
router.get('/findusers/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const db = await dB1();
        const collection = db.collection('users');

        // Create an ObjectId instance from the provided id string
        const userId = new ObjectId(id);

        // Fetch the user document by ID
        const user = await collection.findOne({ _id: userId });

        if (!user) {
            // Handle the case where the user is not found
            res.status(404).send('User not found');
            return;
        } else {

            // Send a JSON response with the user data
            // res.json(user);

            // If you want to render a view for editing the user data, use this:
            res.render('updateUser', { title: `Update ${user.firstname}`, action: 'update', user })
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error ');
    }
});

//delete users 
router.get('/deleteuser/:id', isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const db = await dB1();
        const collection = await db.collection('users');

        // Create an ObjectId instance from the provided id string
        const userId = new ObjectId(id);

        // Fetch the user document by ID
        const user = await collection.findOne({ _id: userId });

        if (!user) {
            // Handle the case where the user is not found
            res.status(404).send('User not found');
            return;
        } else {
            await collection.deleteOne({ _id: userId })
                .then(() => {
                    res.redirect('/admin/findusers/')
                })
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});




//User adding form for admin
router.get('/adduser', isAdmin, (req, res) => {

    res.render('addUser', { title: 'Add User', action: 'Signup page' })
})

//Posting the user adding form 
router.post('/adduser', isAdmin, async (req, res) => {
    try {
      let db = await dB1();
      let connection = await db.collection('users');
  
      // Check if the username already exists in the database
      const existingUser = await connection.findOne({ username: req.body.username });
  
      if (existingUser) {
        // Username already exists, return an error message
        res.render('addUser', { title: 'Add User', action: 'Adding user', incorrect: 'This email is already registered', formaction: '/adduser' });
      } else {
        // Username doesn't exist, proceed with password hashing and insertion
        const saltRounds = 10; // Number of salt rounds (higher is more secure)
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  
        // Update the password field with the hashed password
        req.body.password = hashedPassword;
  
        await connection.insertOne(req.body);
        res.redirect('/admin');
      }
    } catch (error) {
      console.error('Error in /adduser:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  





//Query Search
router.post('/search', isAdmin, async (req, res) => {
    console.log(req.body)
    try {
        const searchQuery = req.body.searchQuery;
        const regexQuery = new RegExp(searchQuery, 'i'); // 'i' for case-insensitive
        const db = await dB1();
        const usersCollection = db.collection('users');

        const results = await usersCollection.find({
            $or: [
                { firstname: { $regex: regexQuery } },
                { lastname: { $regex: regexQuery } },
                { username: { $regex: regexQuery } },
            ]
        }).toArray();


        // Render the same adminFindUser view but with search
        res.render('adminFindUser', { title: `ADMIN Dashboard`, action: 'Find user', welcome: `USER LIST`, button: 'LogOut', users: results });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error In connection to database');
    }
});

// Route to display a all users of users
router.get('/findusers', isAdmin, async (req, res) => {
    try {
        const db = await dB1();
        const collection =await db.collection('users');

        // Fetch all user documents from the database
        const users = await collection.find({}).toArray();

        res.render('adminFindUser', { title: `ADMIN Dashbord`, action: 'Find user', welcome: `USER LIST`, button: 'LogOut', users });


        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal  Server Error');
    }
});
   
//Admin login authentication and assign session 
router.post('/', async (req, res) => {
    try {


        let db = await dB1();
        let collection = db.collection('admins');

        // Wait for both database queries to complete and store their results
        let username1 = await collection.findOne({ username: req.body.username }, { username: 1, _id: 0 });
        let password1 = await collection.findOne({ username: req.body.username }, { password: 1, _id: 0 });


        const { username, password } = req.body;


        if (!username1) { // 
            res.render('index', { title: 'ADMIN LOGIN', action: 'Admin Page', formaciton: '/admin', nextLogin: '/users', nextLoginmsg: 'Go to user login', incorrect: 'No admin with this usernam' });
        } else if ((username === username1.username) && (password !== password1.password)) {
            res.render('index', { title: 'ADMIN LOGIN', action: 'Admin Page', formaciton: '/admin', nextLogin: '/users', nextLoginmsg: 'Go to user login', incorrect: 'Invalid password' });

        } else if ((username === username1.username) && (password === password1.password)) {
            req.session.admin = username;
            let name1 = username1.firstname;
            uppercaseName1 = name1.toUpperCase();


            res.redirect('/admin')

        } else {
            res.render('index', { title: 'ADMIN LOGIN', action: 'Admin Page', formaciton: '/admin', nextLogin: '/users', nextLoginmsg: 'Go to user login', });
        }


    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})
//Admin home page rendering
router.get('/', isAdmin, (req, res) => {
    res.render('admin', { title: `${uppercaseName1} Dashbord`, action: 'Dashboard of admin', welcome: `WELCOME ${uppercaseName1}`, button: 'LogOut' });
})
//Admin login page rendering
router.get('/', (req, res) => {
    res.render('index', { title: 'ADMIN LOGIN', action: 'Admin Page', formaciton: '/admin', nextLogin: '/users', nextLoginmsg: 'Go to user login', });
})

module.exports = router;