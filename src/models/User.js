import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    bookmarks:[
        {
            title:{
                type:String
            },
            url:{
                type:String
            }
        }
    ]
})

export default mongoose.models.user ||  mongoose.model("user",userSchema)