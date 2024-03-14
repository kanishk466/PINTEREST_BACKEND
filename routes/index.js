var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const upload = require('./multer')


const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/feed", function (req, res) {
  res.render("feed");
});

//upload file
router.post("/upload",isLoggedIn,upload.single('file'), async function(req,res){
   if(!req.file ){
     return res.status(400).send('No files were uploaded')
    }
    const user = await userModel.findOne({username : req.session.passport.user})
    const post = await postModel.create({
      image:req.file.filename,
      posttext:req.body.posttext,
      user:user._id
    })

    user.posts.push(post._id);
    await user.save()
    
    res.redirect("/profile");
   
    })




//profile

router.get("/profile",isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  .populate("posts")
  console.log(user)
  res.render("profile",{user});
});

router.get("/login", function (req, res) {
  res.render("login", { error: req.flash('error') });
});
//register user
router.post("/register", function (req, res) {
  var userdata = new userModel({
    // Initialize userModel
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  // Register user with hashed password
  userModel
    .register(userdata, req.body.password) // Register user
    .then(function (registereduser) {
      // On successful registration
      passport.authenticate("local")(req, res, function () {
        // Authenticate user
        res.redirect("/profile"); // Redirect to profile
      });
    });
});


//login
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){})

//logout
router.get("/logout",function(req, res, next) {
  // Handle logout errors
  req.logout(function(err) {
      if(err) {
          // Return error if present
          return next(err);
      }
      // Redirect to homepage after logout
      res.redirect('/');
  })
})



//isloggedin

function isLoggedIn(req,res,next){
  // If user is authenticated
  if(req.isAuthenticated()){
    // Move to the next middleware
    return next();
  }
  // Otherwise, redirect to home page
  res.redirect('/login');
}

module.exports = router;
