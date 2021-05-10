var express = require('express');
var router = express.Router();
const ticketModel=require('../models/ticket.model');


router.post('/createTicket/:id', function(req, res, next) {


    let eventid=req.body.eventid;
    let type=req.body.type;
    let phonemail=req.body.phonemail;
    let discription=req.body.discription;
    let userid=req.params.id;
    let managerid=req.body.managerid;

    let ticketObj=new ticketModel(
      {
        type:type,
        eventid:eventid,
        phonemail:phonemail,
        discription:discription,
        userid:userid,
        managerid:managerid,
        status:'Pending'
      }
    );
    console.log(ticketObj);

    ticketObj.save(function(err,ticketResponse){
      if(err)
      {
        res.send({status:500,message:'unable to find the users'})
      }  
      else{
       
        res.send({status:200,result:"Success"});
      }
    }) 
  }); 

  router.get('/getTicket/:id',function(req,res,next){
    console.log(req.params.id);
      ticketModel.find({'managerid':req.params.id},(err,ticket)=>{
        if(err)
        {
          console.log(err);
          res.status(500).send("error while fetching details");
        }
        const recordCount=ticket.length;
          res.status(200).send({'count':recordCount,'result':ticket});
      })
  });

  router.get('/myTicket/:id',function(req,res,next){
    ticketModel.find({'userid':req.params.id},(err,ticket)=>{
      if(err)
      { 
        console.log(err);
        res.status(500).send("error while fetching details");
      }
      const recordCount=ticket.length;

        res.status(200).send({'count':recordCount,'result':ticket});
    })
  });

  router.get('/updateTicket/:id',function(req,res,next){
    ticketModel.findOneAndUpdate({'managerid':req.params.id},{'status':'resolved'},(err,ticket)=>{
      if(err)
      {
        console.log(err);
        res.status(500).send("Unable to update");
      }

      res.status(200).send("Successfully resolved");
    })
  })


  module.exports = router;  