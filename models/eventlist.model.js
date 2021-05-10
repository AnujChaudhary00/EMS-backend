const mongoose=require('mongoose');


const eventSchema=mongoose.Schema({
        eventname:
        {
            type:String,
            required:true
        },
        managerid:
        {
            type:String,
            required:true
        },
        eventheadname:
        {
            type:String,
            required:true
        },
        organisation:
        {
            type:String,
            required:true
        },
        date:
        {
            type:String,
            required:true
        },
        discription:
        {
            type:String,
            required:true
        },
        fee:
        {
            type:Number,
            required:true
        },
        eventType:{
            type:String,
            require:true
        },
        location:{
            type:String,
            require:true
        },
        photos:{
            type:[]
        }
});



const eventModel=mongoose.model('eventlist',eventSchema);

module.exports=eventModel;