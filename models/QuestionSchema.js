let mongoose = require('mongoose');

let QuestionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    questionaire: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Questionaire'
    },
    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Question', QuestionSchema);