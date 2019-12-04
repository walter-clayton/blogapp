var express         = require("express"),
    methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    app             = express()

    mongoose.connect('mongodb://localhost/blog_app', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err) {
      console.log('Database error: ' + err);
     } else {
      console.log('Successful database connection'); 
     }
    });

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1567185942269-dc5d364a5c62?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
//     body: "Hello this is a blog post!"
// });


// RESTFUL ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
})

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!")
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else {
            // then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("error")
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});


// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
        res.redirect("/blogs");
       } 
       else {
           res.redirect("/blogs");
       }
    });
});

// CONNECT TO PORTS
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});

var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("ready on port 3000 " + port);
});