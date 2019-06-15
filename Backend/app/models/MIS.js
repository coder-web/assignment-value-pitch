const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const dataSchema = new Schema({
    misId: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim:true
    },
    name: {
        type: String,
        required: true,
        trim:true
    },
    fname: {
        type: String,
        required: true,
        trim:true
    },
    address: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        lowercase:true,
        trim:true
    },
    mobile: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('MIS', dataSchema);