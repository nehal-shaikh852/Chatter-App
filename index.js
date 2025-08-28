const express = require("express");
const app = express();
let port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override"); 
const ExpressError = require("./ExpressError");

main().
then ( () => {
    console.log("connection successful");
}).catch ( (err) => {
    console.log(err);
});

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatter");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded( { extended : true}));

// index page
app.get("/chats", async (req, res) => {
    try {
          let chats = await Chat.find();
          res.render("chat.ejs", { chats });
    } catch (err) {
        next(err);
    } 
});  

// add chat 
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", (req, res, next) => {
    try {
    let {from, to, message} = req.body;
    let newChat = new Chat ({
        from : from,
        to : to,
        message : message,
        created_at : new Date(),
    });
    newChat.save();
    res.redirect("/chats");
    } catch (err){
        next(err);
    } 
});

// Edit Route
app.get("/chats/:id/edit", async (req, res, next) => {
    try {
       let {id} = req.params;
       let chat = await Chat.findById(id);
       if (!chat) {
        next(new ExpressError(500, "chat not found"));
       }
        res.render("edit.ejs", {chat});
    } catch (err) {
        next(err);
    }
   
});

app.patch("/chats/:id", async (req, res, next) => {
    try {
         let { id } = req.params;
    let { message: newMessage} = req.body;
    console.log(newMessage);
    await Chat.findByIdAndUpdate( id, {message :newMessage}, {runValidators : true});
    res.redirect("/chats");
    } catch {
        next(err);
    }
   
});

// Destory Route
app.delete("/chats/:id", async (req, res, next) => {
    try {
         let { id } = req.params;
    let deleteChat = await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats");
    } catch (err){
       next(err);
    }
   
});

app.use( (req, res, err) => {
  let {status = 500, message = "something went wrong"} = err;
  res.status(status).send(message);
})


app.listen(port, () => {
    console.log("listning");
});