var mongoose = require("mongoose");
module.exports=function () {

    mongoose.connect("mongodb://127.0.0.1:27017/shopping");
    mongoose.connection.on("connected", function () {
        console.log("mongodb connected success");
    });
    mongoose.connection.on("error", function () {
        console.log("mongodb connected fail");
    });
    mongoose.connection.on("disconnected", function () {
        console.log("mongodb connected disconnected");
    })

}

