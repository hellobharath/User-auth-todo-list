const mongoose = require('mongoose')

// Create user schema
const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    body:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Task', TaskSchema)