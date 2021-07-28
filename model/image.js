// # 1
var mongoose = require("mongoose")
var Schema = mongoose.Schema;


// # 2
var ImageSchema = Schema ({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});



// # 3
module.exports = mongoose.model('images', ImageSchema);
