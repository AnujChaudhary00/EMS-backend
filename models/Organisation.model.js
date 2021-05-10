const mongoose=require('mongoose');

const organisationSchema=mongoose.Schema({
    organisationname:{
        type:String,
        required:true,
    },
    aboutus:{
        type:String
    },
    foundationdate:{
        type:String,
        required:true
    },
    ceoname:{
        type:String,
        required:true
    },
    eventsconducted:
    {
        type:Number,
        required:true,
    },
    teamsize:{
        type:Number,
        required:true
    },
    type:
    {
        type:String,
        required:true
    },
    link:
    {
        type:String
    },
    logo:{
        type:String
    },
    photos:{
        type:[String]
    },
    email:{
        type:String
    },
    slogan:{
        type:String
    },
    managerid:{
        type:String
    }
});


// userSchema.pre('save',async function(next){
//     this.password= bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
//     next();
// })



const organisationModel=mongoose.model('organisations',organisationSchema);

module.exports=organisationModel;