const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },token:{
        type:String
    },
    createdOn:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('User', userSchema);