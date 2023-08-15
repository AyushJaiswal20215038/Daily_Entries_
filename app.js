//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose=require("mongoose");

const app = express();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://ayushjaiswal:Project20215038@cluster0.yod93o4.mongodb.net/blogDB?retryWrites=true&w=majority",{useNewUrlParser:true}).then(()=>{
console.log("successfully connected");
}).catch((e)=>{
console.log("not connected");
});


const postSchema ={
  title: String,
  content: String,
  date: String,
  userID: String
};

const Post =mongoose.model("Post",postSchema);

const userSchema ={
  name :String,
  email :String,
  password :String
};

const User =mongoose.model("User",userSchema);

let newUser=null;


app.get("/", function(req,res){
  
  if(newUser===null){
    res.redirect("/login");
  }
  Post.find({userID:newUser._id}).then(item=>{
    console.log("Item==="+item);
    res.render("home",{
      homeContent: homeStartingContent,
      name: newUser.name,
      postContent: item
    });
  }).catch(err=>{
    console.log("err==="+err);
  });
/*Post.find({}).then(postItem=>{
    res.render("home",{
      homeContent:homeStartingContent,
      postContent:postItem
    });
  });
*/
});

app.get("/posts/:topic",function(req,res){
  
  postArray.forEach(function(Element){
    if(_.lowerCase(Element.title)===_.lowerCase(req.params.topic)){
      res.render("post",{singlePost:Element});
    }
  });

});

app.get("/about", function(req,res){
  res.render("about",{aboutPageContent:aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact",{contactPageContent:contactContent});
});
app.get("/compose", function(req,res){
  res.render("compose");
});
app.get("/login", function(req,res){
  newUser=null;
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  User.findOne({email:req.body.userEmail}).then(newUser=>{
    if(!newUser){
      const user= new User({
        name:req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword
      });
      console.log(req.body.userPassword);
      user.save();
      newUser=user;
      res.redirect("/");
    }else{
      res.send("This email is already in use.. Please use different one<a href=\"/register\"><h1>retry</h1></a>");
    }
  });

});

app.post("/login", function(req,res){
  User.findOne({email :req.body.userEmail}).then(findUser=>{
    if(!findUser){
      res.send("<h3>your Email address does not does not found ...</h3> <h1>Please resister first!!!</h1><a href=\"/register\"><h1>Register Here</h1></a>");
    }
    else if(findUser.password!==req.body.userPassword){
      res.send("<h2>User is already existing and you used incorrect password!!!</h2><br>Please enter correct Password!<a href=\"login\"><h1>Retry</h1></a>");
    }
    else{
      newUser=findUser;
      res.redirect("/");
    }
  });

});
app.post("/compose", function(req,res){
  const today= new Date();
  const options= {year: "numeric",month: "short",day: "numeric"};
  const post=new Post({
  title : req.body.composeTitle,
  content : req.body.composePost,
  date : today.toLocaleDateString(undefined,options),
  userID: newUser._id
  });
  post.save();
  res.redirect("/");
});








app.listen(4000, function() {
  console.log("Server started on port 4000");
});
