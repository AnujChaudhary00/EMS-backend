const mongoose=require('mongoose');


const audienceSchema=mongoose.Schema({

    eventname:{
        type:String,
        required:true
    },
    eventid:
    {
        type:String,
        required:true,
    },
    managerid:{
        type:String,
        required:true
    },
    name:
    {
        type:String,
        required:true,
    },
    fee:
    {
        type:Number,
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
    userid:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    }
});



const audienceModel=mongoose.model('audience',audienceSchema);

module.exports=audienceModel;