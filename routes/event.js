var express=require('express');
var router=express.Router();
const event=require('../models/eventlist.model');
var jwt= require('jsonwebtoken');
const path=require('path');
const multer =require('multer');



router.get('/listEvent',function(req,res,next){
    event.find(function(err,eventListResponse){
        if(err)
        {
          res.send({status:500,message:'records doesnt exsits'});
        } 
        else{
          const recordCount=eventListResponse.length
          res.send({status:200,recordCount:recordCount,result:eventListResponse});
        }
      })
});

const storage=multer.diskStorage({
  destination:function(req,res,cb){
    cb(null,"images");
  },
  filename:function(req,file,cb){
    cb(null,`${Date.now()}_${file.originalname}`);
  }
});

const upload=multer({
  storage:storage
})

router.post('/addEvent',upload.array("uploads[]", 15),function(req,res,next){

    let managerid=req.body.managerid;
    let eventname= req.body.eventname;
    let eventheadname= req.body.eventheadname;
    let organisation= req.body.organisation;
    let date= req.body.date;
    let discription= req.body.discription;
    let fee=req.body.fee;
    let eventType=req.body.eventType;
    let location =req.body.location;
    const files = req.files;
    let index, len;
    let photos=[]

    for (index = 0, len = files.length; index < len; ++index) {
       photos.push(req.protocol+"://"+req.get("host")+"/images/"+files[index].filename);
  }
    // photos.forEach(res=>{console.log(res)});
    let eventObj= new event(
      {
        managerid:managerid,
        eventname:eventname,
        eventheadname:eventheadname,
        organisation:organisation,
        date:date,
        fee:fee,
        discription:discription,
        eventType:eventType,
        photos:photos,
        location:location
      }
    );
    console.log(eventObj);
    eventObj.save(function(err,eventObj){
      if(err){
        console.log(err);
       res.status(403).send(err);
      }
      else{
        res.status(200).send({status:200,message:"added Successfully"});
      }
    });
  });
  


  router.delete('/deleteEvent/:id',function(req,res,next){
    const id=req.params.id;
    event.findByIdAndDelete(id,function(err,eventListResponse){
      if(err)
      {
        console.log(err);
        res.send({status:500,message:'unable to find the event'})
      } 
      else{
        res.send({status:200,message:"event deleted"});
      }
    });
  });


  router.put('/updateEvent/:id',function(req,res,next){

    const eventId=req.params.id;

    let eventname= req.body.eventname;
    let eventheadname= req.body.eventheadname;
    let organisation= req.body.organisation;
    let date= req.body.date;
    let discription= req.body.discription;
    let fee=req.body.fee;
    let eventType=req.body.EventType;

    let eventObj= 
      {
        'eventname':eventname,
        'eventheadname':eventheadname,
        'organisation':organisation,
        'date':date,
        'fee':fee,
        'discription':discription,
        'eventType':eventType
      };
    event.findByIdAndUpdate(eventId,eventObj,{new: true},function(err,eventListResponse){
      if(err)
      {
        res.send({status:500,message:'unable to find the users'})
      } 
      else{
        res.send({status:200,results:eventListResponse});
      }
    });
  });

  router.get('/searchType/:type',function(req,res,next){

    const type=req.params.type;
      event.find({'eventType':type},function(err,eventResponse){
        if(err)
      {
        res.send({status:500,message:"internal server"});
      }
      else{
        const recordCount=eventResponse.length;
        console.log(eventResponse);
        res.send({status:200,count:recordCount,result:eventResponse}); 
      }
      }) 
    
  })

  router.get('/myEvent/:id',function(req,res,next){
    const managerid =req.params.id;
    event.find({'managerid':managerid},function(err,eventResponse)
    {
      if(err)
      {
        console.log(err);
        res.send({status:500,message:"Cannot find Event"})
      }else{

        const recordCount=eventResponse.length
        res.send({status:200,'count':recordCount,result:eventResponse}); 
      }
    })
  });


  
  router.get('/eventDetail/:id',function(req,res,next){
    const id=req.params.id;
    event.findById(id,function(err,eventResponse)
    {
      if(err)
      {
        console.log(err);
        res.send({status:500,message:"Cannot find the event"})
      }else{
        res.send({status:200,result:eventResponse});
      }
    })
  });



  


function verifyToken(req,res,next)
{
  if(!req.headers.authorization)
  {
      return res.status(401).send('Unathorized Request');
  }
  let token= req.headers.authorization.split(' ')[1];
  if(token=='null')
  { 
      return res.status(401).send('Unathorized Request ');   
  }
  
     let payload =jwt.verify(token,'secretpass');

     if(!payload)
     {
         return res.status(401).send("Unathorized request ");
     }
     req.userId=payload.subject;
    
     next();
  }



module.exports=router;