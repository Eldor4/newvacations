const router = require('express').Router()
const User =require('../models/users')
const Flight = require ('../models/flights')
const { verifyAdmin, verifyUser } = require("../verify");

//CREATE
router.post('/add_flights' ,verifyAdmin, async (req, res) => {
    const { description,location,photo,price,checkIn,checkOut } = req.body
    if (description&& location&& photo&& price&& checkIn&& checkOut) {
        try {
            const newFlight = new Flight({ description,location,photo,price,checkIn,checkOut})
            await newFlight.save()
            res.status(201).json({ error: false, msg: "Flight added successfully", newFlight })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json({ error: true, msg: "missing some info" })
    }
})

//READ

router.get('/get_all', async (req, res) => {
    try {
        const result = await Flight.find({})
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id
        const result =   await Flight.findById(id)
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post('/searchdate', async (req, res) => {
    const { checkIn, checkOut } = req.body
    if (checkIn||checkOut) {
        console.log(req.body)
        try {
            const result = await Flight.find(
                {"$or":[
                    {"checkIn":{"$in":  checkIn} }
                   ,{"checkOut":{"$in": checkOut}},
                ]}
                )
                res.json(result)
               console.log(result)
            } catch (error) {
                res.send(error).status(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some info" })
    }
})
router.post('/search', async (req, res) => {
    const { description } = req.body
    if (description) {
        console.log(req.body)
        try {
            const result = await Flight.find(
                {"$or":[
                   {"description":{ "$regex":description, "$options": "i" }}
                ]}
                )
                res.json(result)
               console.log(result)
            } catch (error) {
                res.send(error).status(500)
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some info" })
    }
})
    
router.get('/count/', async (res) => {
    try {        
        const result = await Flight.find({})   
        res.json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})
    
    router.put('/follow',verifyUser,async(req,res)=>{
        const {userId,flightId}= req.body
        if(userId&&flightId)
        try {
            const follow1 = await User.updateOne({"_id":userId},{ $push:{"vacation":flightId}})
            const follow2= await Flight.updateOne({"_id":flightId},{ $push:{"followers":userId}})
            res.json(follow1&&follow2)
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    })
    router.put('/testtwo',async(req,res)=>{
        const {userId}= req.body
        if(userId)
        try {
            const vacationsId = await User.find({"_id":userId},"vacation")
            const vacationsId2=vacationsId[0].vacation
            const vacations = await Flight.find({"_id":vacationsId2})
            const notVacations = await Flight.find({"_id":{$nin:vacationsId2}})
            const arrayOfAll = [vacations,notVacations]
            res.json(arrayOfAll)
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    })
    
    router.put('/edit_flights/:_id' ,verifyAdmin, async (req, res) => {
        const _id = req.params._id
        const { description,location,photo,price,checkIn,checkOut } = req.body
        if (description&& location&& photo&& price&& checkIn&& checkOut) {
            try {
                const flight = { description,location,photo,price,checkIn,checkOut}
                // await newFlight.save()
                await Flight.updateOne({ "_id": _id }, flight)

                res.status(201).json({ error: false, msg: "Flight edit successfully", flight })
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }
        } else {
            res.status(400).json({ error: true, msg: "missing some info" })
        }
    })
    //DELETE
router.delete('/unfollow',verifyUser,async(req,res)=>{
    const {userId,flightId}= req.body
    if(userId&&flightId)
    try {
        const follow1=await Flight.updateOne({"_id":flightId},{ $pull:{"followers":userId}})
        const follow2 = await User.updateOne({"_id":userId},{ $pull:{"vacation":flightId}})
        res.json(follow1&&follow2)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router