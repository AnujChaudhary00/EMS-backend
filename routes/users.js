var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const client = require('twilio')('ACca811e634e318c8a059b7f8da1f1cf7d', '19f88bd163f5cf2f64baae72b7110ada');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

var mongoose = require('mongoose');
const { create } = require('../models/user.model');
const userModel = require('../models/user.model');
const contactModel=require('../models/contactus.model');
const { send } = require('process');

/* GET users listing. */
router.get('/list', function (req, res, next) {
  userModel.find(function (err, userListResponse) {
    if (err) {
      res.send({ status: 500, message: 'unable to find the users' })
    }
    else {
      const recordCount = userListResponse.length
      res.send({ status: 200, recordCount: recordCount, results: userListResponse });
    }
  })
});

const maxAge =  60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secretpass', {
    expiresIn: maxAge
  })
}



router.post('/login', function (req, res, next) {
  let auth;
  userModel.findOne({ email: (req.body.email).toLowerCase() }).then(function (user) {
    if (!user) {
      res.send({ status: 404, message: 'Email incorrect' });
    } else {
      let reqPass = req.body.password;
      let userPass = user.password;
      if (reqPass===userPass) {
        console.log("logged in");
        const token = createToken(user._id);
        res.status(200).send({ 'id': user._id, 'role': user.role, 'token': token });
      }
      else {
        console.log('Comparison error: ', err);
        res.send({ status: 401, message: 'Incorrect Password' });
      }
    }
  }).catch(err => {
    console.log(err);
    res.send({ status: 500, message: "unknown error" })
  })
});

router.get('/verify', function (req, res, next) {

  if (req.query.phoneno) {
    client
      .verify
      .services('VA6e441611786ec641735df7c7fd818f22')
      .verifications
      .create({
        to: `+91${req.query.phoneno}`,
        channel: 'sms'
      }).then(data => {
        res.status(200).send(data)
      })
      .catch(err => {
        res.send(err);
      })

  }
  else {
    console.log("error");
    res.send("error");
  }
})

router.get('/verifycode', (req, res) => {
  client
    .verify
    .services('VA6e441611786ec641735df7c7fd818f22')
    .verificationChecks
    .create({
      to: `+91${req.query.phoneno}`,
      code: req.query.code
    })
    .then(data => {
      res.status(200).send(data)
    })
})



const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage: storage
})


router.post('/signup', upload.single("profilepic"), function (req, res, next) {

  let firstname = req.body.firstName;
  let lastname = req.body.lastName;
  let email = (req.body.email).toLowerCase();
  let phone = req.body.phone;
  let dob = req.body.dob;
  let pass = req.body.password;
  let role = req.body.role;
  let gender = req.body.gender;
  let profilepic
  let url = req.protocol + "://" + req.get("host");
  if (req.file != null) {
    console.log(req.file);
  } else {
    console.log("error in getting image")
  }

  let userObj = new userModel(
    {
      firstname: firstname,
      lastname: lastname,
      email: email.toLowerCase(),
      phone: phone,
      password: pass,
      role: role,
      dob: dob,
      gender: gender,
      profilepic: url + "/images/" + req.file.filename
    }
  );
  console.log(userObj);

  userObj.save(function (err, userObj) {
    if (err) {
      console.log(err);
      res.status(401).send(err);
    }
    else {
      const token = createToken(userObj._id);
      res.status(200).send({ 'id': userObj._id, 'token': token, 'role': userObj.role });
    }
  });

});


router.delete('/delete/:id', function (req, res, next) {
  const userId = req.params.id;
  userModel.findByIdAndDelete(userId, function (err, userListResponse) {
    if (err) {
      console.log(err);
      res.send({ status: 500, message: 'unable to find the users' })
    }
    else {
      res.send({ status: 200, message: "User deleted" });
    }
  });
});


router.get('/forgotPassword/:email', function (req, res) { 
  console.log('sending email..');

  let transport = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'nikkichuadhary896@gmail.com',
      pass: 'Chaudhary#1'
    }
  });

  userModel.find({ 'email': req.params.email.toLowerCase() }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    if (user.length == 0) {
      res.send({ "messgae": "Email Not Found! Please enter the registered Email", "status": 401 });
    } else {
      console.log(user);
      console.log(user[0].email);
      const message = {
        from: 'nikkichuadhary896@gmail.com',
        to: user[0].email,
        subject: 'Forgot Password',
        text: `Hi ${user[0].firstname}, a request of forgot password has been recieved from your account, here is your password ${user[0].password}, please change your password from profile setting option in dashboard.` // Plain text body
      };

      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log('mail has sent.');
          console.log(info);
          res.send({ 'status': 200 });
        }
      });
    }

  });

});



router.put('/update/:id', function (req, res, next) {

  const userId = req.params.id;


  let firstname = req.body.firstName;
  let lastname = req.body.lastName;
  let email = req.body.email;
  let phone = req.body.phone;
  let dob = req.body.dob;
  let password = req.body.password;
  let role = req.body.role;
  let gender = req.body.gender;

  let userObj =
  {
    'firstname': firstname,
    'lastname': lastname,
    'email': email.toLowerCase(),
    'phone': phone,
    'password': password,
    'role': role,
    'dob': dob,
    'gender': gender
  };
  userModel.findByIdAndUpdate(userId, userObj, { new: true }, function (err, userListResponse) {
    if (err) {
      res.send({ status: 500, message: 'unable to find the users' })
    }
    else {
      console.log(userListResponse);
      res.send({ status: 200, results: userListResponse });
    }
  });
})

router.get('/search/:id', function (req, res, next) {
  const userId = req.params.id;
  userModel.findById(userId, function (err, userResponse) {
    if (err) {
      console.log(err);
      res.send({ status: 500, message: "Cannot find the user" })
    } else {
      const recordCount = userResponse.length;
      res.send({ status: 200, recordCount: recordCount, results: userResponse });
    }
  })
})

router.post('/contactus',function(req,res,next)
{
  let ContactObj=new contactModel({
     name:req.body.name,
     email:req.body.email,
     query:req.body.query
  });
  console.log(ContactObj);

  ContactObj.save(function(err,response)
  {
    if(err)
    {
      console.log(err);
      res.send({status:500,message:"Error while saving"});
    }
    else{
      res.send({status:200,message:"Success"});
    }
  })
})



function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unathorized Request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token == 'null') {
    return res.status(401).send('Unathorized Request ');
  }

  let payload = jwt.verify(token, 'secretpass');

  if (!payload) {
    return res.status(401).send("Unathorized request ");
  }
  req.userId = payload.subject;

  next();
}



module.exports = router;
