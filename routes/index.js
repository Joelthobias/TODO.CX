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
        res.redirect("/signin");
    }
}


// GET Ports


  router.get('/signin',(req, res) => {
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




// POST Ports


  router.post('/signin',(req,res)=>{
    var decoded = jwt.decode(req.body.credential);
    let {email,name,picture}=decoded
    let UserData={
      email,name,picture
    }
    // res.json({UserData})
    let User=todoHelper.findUser(email)
    let status=false
    if(User){
      req.session.user=UserData
      req.session.loggedin=true
      res.redirect('/view-todos')
    }else{
      todoHelper.addUser(UserData).then((response)=>{
        if(status){
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





















router.get('/', function (req, res, next) {
    res.send("hi")
});
router.get('/signin',(req,res)=>{

  res.render('sigin')
})
  router.post('/signin', function (req, res, next) {
      req.session.user = req.body
      let email = req.body.email
      let data = req.body
      todoHelper.findUser(email).then((response) => {
          if (response) {
              res.json({data: response})

          } else {

              todoHelper.addUser(req.body).then((response) => {
                  res.json({datas: req.body})
                  req.session.loggedIn = true
                  req.session.user = req.body
                  console.log(req.session.user);
              })
          }
      })

  });
router.post('/addTodo', (req, res) => {

    console.log(req.session.loggedIn);
    console.log(req.body);
    // todoHelper.addTodo(req.body,user).then((response)=>{
    // res.json("done")
    // })
})
module.exports = router;
