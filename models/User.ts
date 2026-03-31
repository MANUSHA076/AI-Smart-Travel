import mongoose, { models, Schema,model } from "mongoose";

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
},{ timestamps: true });

const User=models.User || mongoose.model("User",UserSchema);
export default User;