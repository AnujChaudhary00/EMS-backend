var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');

const organisationModel = require('../models/organisation.model');
const applicationModel = require('../models/application.model');

/* GET users listing. */
router.get('/listOrganisation', function (req, res, next) {
    organisationModel.find(function (err, organisationListResponse) {
    if (err) {
      res.send({ status: 500, message: 'Internal Error! Please try Again' });
    }
    else {
      const recordCount = organisationListResponse.length
      res.send({ status: 200, count: recordCount, result: organisationListResponse });
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


router.post('/addOrganisation/:managerid', upload.array("uploads[]", 15), function (req, res, next) {

  let organisationname = req.body.organisationname;
  let aboutus = req.body.aboutus;
  let foundationdate = req.body.foundationdate;
  let ceoname = req.body.ceoname;
  let eventsconducted = req.body.eventsconducted;
  let teamsize = req.body.teamsize;
  let type = req.body.type;
  let link = req.body.link;
  let email=req.body.email;
  let slogan=req.body.slogan;
  let managerid=req.params.managerid;
  const files = req.files;
  let index, len;
  let photos=[];

  for (index = 0, len = files.length; index < len; ++index) {
    photos.push(req.protocol+"://"+req.get("host")+"/images/"+files[index].filename);
}


  let organisationObj = new organisationModel(
    {
      organisationname: organisationname,
      aboutus: aboutus,
      foundationdate:foundationdate, 
      ceoname: ceoname,
      eventsconducted: eventsconducted,
      teamsize: teamsize,
      type: type,
      link: link,
      email:email,
      slogan:slogan,
      photos:photos,
      managerid:managerid
    }
  );

    console.log(organisationObj);
  organisationObj.save(function (err, organisationObj) {
    if (err) {
      console.log(err);
      res.status(401).send({status:401,message:"Error"});
    }
    else {
      res.status(200).send({status:200,"message":"Organisation details Added"});
    }
  });
});


const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
    console.log(file)
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload2 = multer({ 
  storage: storage2
})


router.post('/addLogo/:id',upload2.single('logo'),function(err,res,next){
  const id=req.params.id;


  let url = req.protocol + "://" + req.get("host");
  if (req.file != null) {
    
  } else {
    console.log("error in getting image")
  }
  
  organisationModel.findByIdAndUpdate(id,{'logo':`${url}"/images/"${req.file.filename}`},function(err,logoResponse)
  {
  
    if(err)
    {
      console.log(err);
      res.status(500).send("Failed to update! please try again later");
    }

    res.status(200).send("Logo Updated");
  })
})


router.put('/updateOrganisation/:orgid', function (req, res, next) {

  const orgid = req.params.orgid;


  let organisationname = req.body.organisationname;
  let aboutus = req.body.aboutus;
  let foundationdate = req.body.foundationdate;
  let ceoname = req.body.ceoname;
  let eventsconducted = req.body.eventsconducted;
  let teamsize = req.body.teamsize;
  let type = req.body.type;
  let email = req.body.email;
  let link=req.body.email;
  let slogan=req.body.slogan;

  let organisationObj =
  {
    'organisationname': organisationname,
    'aboutus': aboutus,
    'foundationdate': foundationdate,
    'ceoname': ceoname,
    'eventsconducted': eventsconducted,
    'teamsize': teamsize,
    'type': type,
    'email': email,
    'link':link,
    'slogan':slogan
  };
  
  organisationModel.findByIdAndUpdate(orgid, organisationObj, { new: true }, function (err, organisationListResponse) {
    if (err) {
      res.send({ status: 500, message: 'unable to find the users' })
    }
    else {
      res.send({ status: 200, result: organisationListResponse });
    }
  });
})

router.get('/myOrganisation/:managerid', function (req, res, next) {
  const managerid = req.params.managerid;
  organisationModel.find({'managerid':managerid}, function (err, orgResponse) {
    if (err) {
      console.log(err);
      res.send({ status: 500, message: "Cannot find the organisation" })
    } else {
      const recordCount = orgResponse.length;
      res.send({ status: 200, count: recordCount, result: orgResponse });
    }
  })
});


router.get('/search/:data',function(req,res,next){
  const name=req.params.data;

  organisationModel.find({'organisationname':name},function(err,searchResponse){
    if(err)
    {
      console.log(err);
      res.status(500).send(err);
    }
    let length=searchResponse.length;
    res.status(200).send({result:searchResponse,count:length});
  })


})



router.get('/organisation-detail/:id',function(req,res,next){
  const id=req.params.id;

  organisationModel.findById(id,function(err,searchResponse){
    if(err)
    {
      console.log(err);
      res.status(500).send({status:500,message:"error in searching"});
    }
    let length=searchResponse.length;
    res.status(200).send({result:searchResponse,count:length});
  }) 


})

router.post('/apply/:userid',function(req,res,next){
    let application=new applicationModel({
      name:req.body.name,
      organisation:req.body.organisation,
      cvlink:req.body.cvlink,
      phone:req.body.phone,
      email:req.body.email,
      gender:req.body.gender,
      managerid:req.body.managerid,
      userid:req.params.userid,
      status:req.body.status
    });

    application.save(function(err,appResponse){
      if(err)
      {
        console.log(err);
        res.status(500).send("Unable to proceed the request right now");
      }
      res.status(200).send({status:200,message:"Success"});
    })
})


router.get('/my-application/:id',function(req,res,next){
  const id=req.params.id;

  applicationModel.find({"userid":id},function(err,applicationresponse){
    if(err)
    {
      console.log(err);
      res.status(500).send({status:500,message:"Error"});
    }
    const recordLength=applicationresponse.length;
    res.status(200).send({statsu:200,result:applicationresponse,count:recordLength});
  })


})





// function verifyToken(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(401).send('Unathorized Request');
//   }
//   let token = req.headers.authorization.split(' ')[1];
//   if (token == 'null') {
//     return res.status(401).send('Unathorized Request ');
//   }

//   let payload = jwt.verify(token, 'secretpass');

//   if (!payload) {
//     return res.status(401).send("Unathorized request ");
//   }
//   req.userId = payload.subject;

//   next();
// }

module.exports = router;
