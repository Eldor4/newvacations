const {Schema,model}= require('mongoose')


const flightSchema = new Schema({
    description:String,
    location:String,
    photo:String,
    price:Number,
    followers:Array,
    checkIn:Date,
    checkOut:Date,
})
 
const Flight =model('flight',flightSchema)
module.exports = Flight