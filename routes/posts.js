const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/pinterestbackend")

const postSchema = new mongoose.Schema({
  posttext: {
    type: String,
    required: true,
  },
  user  :{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  image:{
    type:String
  },
  currentAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

 module.exports = mongoose.model('Post', postSchema);


