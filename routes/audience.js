var express=require('express');
var router=express.Router();
const audienceModel=require('../models/audienceDetail.model');

router.get('/listAudience/:managerid', function(req, res, next) {
    audienceModel.find({'managerid':req.params.managerid},function(err,audienceListResponse){
      if(err)
      {
        res.send({status:500,message:'unable to find the users'})
      } 
      else{
        const recordCount=audienceListResponse.length
        res.send({status:200,count:recordCount,result:audienceListResponse});
      }
    })
  });


  
router.post('/bookEvent/:id',function(req,res,next){

    let eventname= req.body.eventname;
    let eventid=req.body.eventid;
    let managerid= req.body.managerid;
    let email= req.body.email;
    let phone= req.body.phone;
    let fee=req.body.fee;
    let name=req.body.name;
    let userid=req.params.id;
    let gender=req.body.gender;
    let date=req.body.date;
  
    let audienceObj= new audienceModel(
      {
        userid:userid,
        eventid:eventid,
        eventname:eventname,
        email:email,
        phone:phone, 
        name:name,
        fee:fee,
        managerid:managerid,
        gender:gender,
        date:date
      }
    );
    const length=0;

    audienceModel.find({'userid':userid,'eventid':eventid},function(err,audResponse){
      if(err)
      {
        console.log(err);
      }
         this.length=audResponse.length;
    })

    if(length==0){
    audienceObj.save(function(err,audienceObj){
      if(err){
        console.log(err);
       res.status(401).send(err);
      }
      else{ 
        console.log(audienceObj)
        res.status(200).send({audienceObj});
      }
    });
  }else{
    res.status(304).send({status:304,message:"Already registered"});
  }
  
  });

  
// router.put('/updateAudience/:id',function(req,res,next){

//     const userId=req.params.id;
  
//     let userid=tenantId;
//     let pgbookedname= req.body.pgbookedname;
//     let pgid= req.body.pgid;
//     let email= req.body.email;
//     let phone= req.body.phone;
//     let name=req.body.name;
//     let payment=req.body.payment;
  
//     let tenatObj= 
//       {
//         'userid':userid,
//         'pgbookedname':pgbookedname,
//         'pgid':pgid,
//         'email':email,
//         'phone':phone,
//         'name':name,
//         'payment':payment
//       };
//       tenantModel.findByIdAndUpdate(tenantId,tenatObj,{new: true},function(err,tenantRes){
//       if(err)
//       {
//         res.send({status:500,message:'unable to find the users'})
//       } 
//       else{
//         res.send({status:200,results:"Success"});
//       }
//     });
//   });


  
router.get('/myEvents/:id',function(req,res,next){
    const userId=req.params.id;
    audienceModel.find({'userid':userId},function(err,audienceResponse)
    {
      if(err)
      {
        console.log(err);
        res.send({status:500,message:"Cannot find the tenant"})
      }else{
        const recordCount=audienceResponse.length;
        res.send({status:200,result:audienceResponse,'count':recordCount});
      }
    })
  });

  // router.delete('/cencelbooking',function(req,res,next){
  //   const tenantId=req.params.id;
  //   const pgid=req.params.pgid;
  //   tenantModel.findOneAndDelete({'userid':tenantId,'pgid':pgid},function(err,tenantResponse){
  //     if(err)
  //     {
  //       console.log(err);
  //       res.send({status:404,message:'unable to find and delete the PG'})
  //     } 
  //     else{
  //       res.send({status:200,message:"tenant deleted"});
  //     }
  //   });
  // });

  
  
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
      
       next();
    }
  

module.exports=router;