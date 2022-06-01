const { async } = require('@firebase/util');
const { response } = require('express');
var express = require('express');
// const {signInWithPopup, getAuth, initializeApp, GoogleAuthProvider} = require('firebase/auth');

var jwt = require('jsonwebtoken');

const { auth, provider } = require('../helpers/Gauth');
const todoHelper = require('../helpers/todoHelper');
var router = express.Router();
const verifylogin = (req, res, next) => {
    if (req.session.loggedin) {
        next(); 
    } else {
        res.redirect("/");
    }
}


// GET Ports


  router.get('/',(req, res) => {
    res.render('user/signin')
  })

  router.get('/view-todos',verifylogin,(req,res)=>{
    let user=req.session.user
    console.log(user.email) 
    todoHelper.Todos(user.email).then((response)=>{
      console.log(response); 
        // res.json({
        //   response
        // })
      res.render("todo/view-todo",{response})
    })
  })
  // sort by Status
  router.get('/view-todo/:status',verifylogin,(req,res)=>{
    let email=req.session.user.email
    let status=req.params.status
    // res.json({status})
    console.log(status + email);
    todoHelper.viewtodos(status,email).then((response)=>{
      console.log(response); 
      res.render("todo/view-todo",{response})
    })
  })
  // Update Status and mark todo as Delete
  router.get('/update-sts/:status/:date',verifylogin,(req,res)=>{
    let email=req.session.user.email
    let {status}=req.params
    let {date}=req.params
    // res.json({status})
    console.log(status +" gggggggg "+ date);
    todoHelper.changeStatus(status,date,email).then(()=>{
        res.json({
          data:response,
          user:req.session.user
        })
    })
  })


// POST Ports


  router.post('/signin',async(req,res)=>{
    var decoded = jwt.decode(req.body.credential);
    let {email,name,picture}=decoded
    let UserData={
      email,name,picture
    }
    // res.json({UserData})
  
    
    let User=await todoHelper.findUser(email)
    if(User){
      req.session.user=UserData
      req.session.loggedin=true
      res.redirect('/view-todos')
    }else{
      todoHelper.addUser(UserData).then((response)=>{

        if(response){
          console.log("user created");
          req.session.user=UserData
          req.session.loggedin=true
          res.redirect('/view-todos')
          // res.json({
          //   message:"create User",
          //   status:200
          // })
          
        }else{
          res.json({
            message:"Unable to create User",
            status:false
          })
        }
      })
    }
  })
  router.post('/add-todo',(req,res)=>{
    let todo=req.body
    let user=req.session.user.email
    todoHelper.addTodo(todo,user).then((response)=>{
      res.redirect('/view-todos')
    })
  })

module.exports = router;
