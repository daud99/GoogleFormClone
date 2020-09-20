let mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: false,
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: 'User',
    },
    questionaire: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Questionaire',
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Question',
    }
  }, {
    timestamps: true,
});

module.exports = mongoose.model('Answer', AnswerSchema);