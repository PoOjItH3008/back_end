const mongoose=require('mongoose');

const LoginSchema=mongoose.Schema({
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

const Login=mongoose.model("Login",LoginSchema);
module.exports = Login;