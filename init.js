const mongoose = require("mongoose");
const Chat = require("./models/chat.js");


main().then ( res => {
    console.log("working");
}).catch ( err => {console.log (err)});

async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatter");
}

let allChats = [
    {
        from : "yusuf",
        to : "yunus",
        message : "Send me today notes",
        created_at : new Date(),
    },
    {
        from : "ilyas",
        to : "ishaq",
        message : "whats going on!",
        created_at : new Date(),
    },
    {
        from : "khalil",
        to : "khalid",
        message : "we will learn togeteher",
        created_at : new Date(),
    },
    {
        from : "zubair",
        to : "hamza",
        message : "Lets call it a day",
        created_at : new Date(),
    }
];

Chat.insertMany(allChats).then ( res => {
    console.log(res);
}) .catch (err => {
    console.log(err);
});