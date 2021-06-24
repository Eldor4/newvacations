const router =require('express').Router()
const jwt = require('jsonwebtoken')
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { verifyUser,verifyAdmin } = require("../verify");

const Flight =require('../models/flights')
const User =require('../models/users')

//CREATE

router.post('/register', async (req, res) => {

    const { firstName,lastName,userName,password } = req.body
    const getUserName = await User.find({userName})
    if(getUserName.length===0){
        
        if (firstName && lastName && userName && password) {
            const salt = genSaltSync(10)
            const hash = hashSync(password, salt)
            try {
                const newUser = new User({ firstName, lastName,userName, password: hash, role: "user" })
                const result = await newUser.save()
                let token = jwt.sign({ userName, firstName, role: result.role }, "blah", { expiresIn: "10m" })
                res.status(201).json({ error: false, msg: "The user has registered successfully", token, result})
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some info" })
        }
    }else{
        res.status(401).json({ error: true, msg: "user is exist" })

    }
    })

//READ
router.post('/login', async (req, res) => {
    const { userName, password } = req.body
    if (userName && password) {
        try {
            const result = await User.find({ userName })
            if (result.length === 0) {
                res.status(201).json({ error: true, msg: "The userName dosn't exist" })
            } else {
                const check = compareSync(password, result[0].password)
                if (check) {
                    let token = jwt.sign({ userName: result[0].userName, firstName: result[0].firstName, role: result[0].role }, "blah", { expiresIn: "10m" })
                    res.status(201).json({ error: false, msg: " user logged in successfully", token, result })
                }
                else{
                    res.status(201).json({ error: true, msg: "wrong password"})
                }
            }

        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

//READ
router.put('/get_all_user', async (req, res) => {
    const {userName}= req.body
    try {
        const getUserName = await User.find({userName})
        if(getUserName.length===0){
            res.status(201).json({error:false,msg:true})
        }else{
            res.status(201).json({error:false,msg:false})
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.put('/followers_vacations',verifyUser,async(req,res)=>{
    const {userId}= req.body
    if(userId)
    try {
        const getFollowes = await User.find({"_id":userId},"vacation")
        const followersList=getFollowes[0].vacation
        const followers = await Flight.find({"_id":{$in:followersList}})
        res.json(followers)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
router.put('/unfollowers_vacations',verifyUser,async(req,res)=>{
    const {userId}= req.body
    if(userId)
    try {
        const getFollowes = await User.find({"_id":userId},"vacation")
        const followersList=getFollowes[0].vacation
        const unfollowers = await Flight.find({"_id":{$nin:followersList}})
        res.json(unfollowers)
        
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

//UPDATE
//DELETE    
module.exports = router