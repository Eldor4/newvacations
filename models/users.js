const {Schema,model}= require('mongoose')
const userSchema = new Schema({
    firstName:String,
    lastName:String,
    userName:String,
    password:String,
    role:String,
    vacation:Array
})

const User=model('user',userSchema)
module.exports = User