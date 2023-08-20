const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: { type: String },
    description: { type: String },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('post', PostSchema)