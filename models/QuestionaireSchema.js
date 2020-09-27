let mongoose = require('mongoose');

let QuestionaireSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: false,
    },
    upVote: {
        type: Number,
        default: 0
    },
    downVote: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    backgroundImage: {
        type: String,
        trim: true
    },
    backgroundColor: {
        type: String,
        trim: true
    },
    backgroundVideo: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'UserSchema',
    },
    questions: [
        { type: mongoose.Schema.Types.ObjectId, 
          ref: 'Question',
          required: true
        }
    ],
    answers: [
        { type: mongoose.Schema.Types.ObjectId, 
          ref: 'Answer',
          required: true
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Questionaire', QuestionaireSchema);