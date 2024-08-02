const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'IamGroot'
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');

const { body, validationResult } = require('express-validator');

//ROUTE 1: Post create a user /createuser (no login required)
router.post('/createuser', [
    body('name', 'Must be at least 3 character').isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body("password", "Must be at least 5 character").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() })
    }

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success, errors: "User already exists with this email" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        })

        //this data will use id as jwt token along with jwt secret 
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        // res.json(user)
        success = true
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 2: Post: login a user /login (no login required)
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({ email})
        if (!user) {
            return res.status(400).json({ success, errors: "Please try to logn with correct credential1" })
        }

        const passCompare = await bcrypt.compare(password, user.password);
        
        if(!passCompare){
            return res.status(400).json({ success, errors: "Please try to logn with correct credential2" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

//ROUTE 3: Post: fetch detail of logged in user /getuser. Login required
//In this we have to send JWT token (we have use middleware for this)
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})

module.exports = router;