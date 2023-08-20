const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

//REGISTER
router.post("/register", (req, res) => {
    //OBJECT DESTRUCTURING
    const { name, username, password, password2} = req.body
    if(username.length < 8) return res.status(400).json({msg: "Username should be atleast 8 characters"})
    if(password.length < 8) return res.status(400).json({msg: "Password should be atleast 8 characters"})
    if(password != password2) return res.status(400).json({msg: "Passwords do not match"})
    
    User.findOne({username}, (err, foundUser) => {
        if(foundUser) {
            return res.status(400).json({msg: "User already exists"})
        } else {
            const user = new User()
            user.name = name
            user.username = username

            //Hash the Password
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            user.password = hash
            user.save()
            return res.json({
                msg: "Registered Successfully",
                user
            })
        }
    })
})

//Async Await
// router.post("/register", async (req,res) => {
//     const { name, username, password, password2} = req.body
//     try{
//         if(username.length < 8) return res.status(400).json({msg: "Username should be atleast 8 characters"})
//         if(password.length < 8) return res.status(400).json({msg: "Password should be atleast 8 characters"})
//         if(password != password2) return res.status(400).json({msg: "Passwords do not match"})

//         let user = await User.findOne({username}, (err, foundOne) => {
//             if(foundOne) {
//                 return res.status(400).json({msg: "User already exists"})
//             } else {
//                 const user = new User()
//                 user.name = name
//                 user.username = username
    
//                 //Hash the Password
//                 let salt = bcrypt.genSaltSync(10)
//                 let hash = bcrypt.hashSync(password, salt)
    
//                 user.password = hash
//                 user.save()
//                 return res.json({
//                     msg: "Registered Successfully",
//                     user
//                 })
//             }
//         })
//     } catch(err) {
//         return res.json({
//             msg: "Registration Not Successfull"
//         })
//     }
// })

//LOGIN
router.post("/login", (req, res) => {
    const { username, password} = req.body

    //Check if the user exists
    User.findOne({username}, (err, user) => {
        if(!user) {
            return res.status(400).json({msg: "User does not exist"})
        }

        let isMatch = bcrypt.compareSync(password, user.password)

        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"})

        let payload = {
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            }
        }

        //Syntax jwt.sign(payload, secretKey, options, callback)
        jwt.sign(
            payload,
            "positive",
            {expiresIn: "1hr"},
            (err, token) => {
                if(err) {
                    return res.status(400).json({err})
                } else {
                    return res.json({type: "success", msg: "Logged In", token})
                }
            }
        )
    })
})


module.exports = router