const mongoose=require('mongoose');

const applicationSchema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    organisation:
    {
        type:String,
        required:true,
    },
    cvlink:
    {
        type:String,
        required:true,
    },
    phone:
    {
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    managerid:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true 
    },
    status:{
        type:String,
        default:"pending"
    }
});



const applicationModel=mongoose.model('applications',applicationSchema);

module.exports=applicationModel;