// used to create a server
const express=require("express")
/// to parse the request ,to extract the user data
const bodyParser=require("body-parser")
// for dynamic web page, meaning only structure is defined the value are variable(templating)
const ejs=require("ejs")
const _ = require('lodash');
// to let the app.js to talk to the mongoDB ,mongoose is used as driver
const mongoose=require("mongoose");
// app for customizing the server
const app=express();
// default data
const homeStartingContent="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,"
const aboutContent="Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the "
const contactContent="Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section "
//  connect to the local designated area for creation of database,blogDB is created in the area
mongoose.connect("mongodb+srv://admin-kundan:Kundan%4019@cluster0.0qyqn.mongodb.net/PostDB?retryWrites=true&w=majority");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
// schema of one of the collection of the blogDB 
const postSchema=mongoose.Schema({
    title:String,
    postContent:String
})
//use the document structure and create the collection of it
const Post=mongoose.model("post",postSchema);
// as data is passed as form data
app.use(bodyParser.urlencoded({extended:true}))
// along with default file , hosted automatically by the node ,host a public file also
app.use(express.static('public'))
// to set the ejs as the view engine to render the .ejs file for html
app.set('view engine','ejs')
// to receive request on the home route
app.get("/",function(req,res){
    // to render all the data present on to the page
    // first we extract all posts from our data base and then send it to the ejs(frontend)
    Post.find({},function(err,posts){
        if(!err){
            res.render("home",{initialContent:homeStartingContent,
                Posts:posts})
        }
    })
    
})
// several route's for functionalities
app.get("/contact",function(req,res){
    res.render('contact',{homeDes:contactContent})
})
app.get("/about",function(req,res){
    res.render('about',{homeDes:aboutContent})
})
app.get("/compose",function(req,res){
    res.render('compose')
})
// dynamic page generation of each post
// so that the maximise version of a particular post can be render singly on entire page
// grab the url provided by the ejs (anchor tag)
app.get("/post/:specific",function(req,res){
      let postId=req.params.specific;
      // find the post which have the id provided by the user
      Post.findById(postId,function(err,post)
        {
if(!err){
    res.render("post",{Title:post.title,postDetail:post.postContent});
}
      })

})
 
   
// to allow the user to post on the compose page
// after the post request is received we need to create a new post document and insert the post detail in it
// and finally save in the collection
app.post('/compose',function(req,res){
    const lower=_.lowerCase(req.body.titleText).split(" ").join("_")

  const postDetail=new Post({
    title:req.body.titleText,
    postContent:req.body.postText
  })
  postDetail.save()
// redirect(send a get request on the home route) and display all the posts'
res.redirect("/")
})

 // the server is monitoring on portno 3000 which means all communication through is
app.listen((3000),function(){
    console.log("server is established");
})