const { async } = require('@firebase/util');
const { response } = require('express');
var express = require('express');
// const {signInWithPopup, getAuth, initializeApp, GoogleAuthProvider} = require('firebase/auth');

var jwt = require('jsonwebtoken');

const { auth, provider } = require('../helpers/Gauth');
const todoHelper = require('../helpers/todoHelper');
var router = express.Router();



// GET Ports


router.get('/signin',(req, res) => {


  res.render('user/signin')

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
      todoHelper.viewTodos(email).then((response)=>{
        res.render("todo/view-todo",{response})
      })
    }else{
      todoHelper.addUser(UserData).then((response)=>{
        if(status){
          todoHelper.viewTodos(email).then((response)=>{
            // res.json({data:response})
            res.render("todo/view-todo",{response})
          })
          
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
