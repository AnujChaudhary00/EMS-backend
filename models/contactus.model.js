const mongoose=require('mongoose');

const contactSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
        },
    query:
    {
        type:String,
        required:true
    }
});



const contactModel=mongoose.model('contact',contactSchema);

module.exports=contactModel;