const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0/pass')


const userSchema = mongoose.Schema({
    username:{
      type:String,
      unique:true,
    },
    password:String,
    email:{
      type:String,
      unique:true
    },
  
  })
  
  module.exports = mongoose.model('user',userSchema)