const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter name "]
    },
    email:{
        type:String,
        required:[true,"Please enter email "],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please enter password "]
    },
    image:{
        type:String,
        required:false
    }
},
{
timestamps:true,
}
);

const User=mongoose.model("User",UserSchema);
module.exports = User;