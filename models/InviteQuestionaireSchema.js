let mongoose = require('mongoose');

let InviteQuestionaireSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    questionaire: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Questionaire'
    },
    invitedUserEmail: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'UserSchema'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema'
    },
    status: {
        type: String
    },
    permission: {
        type: String,
        required: true,
        validate: {
            validator: (v) => v == "r" || v == "w"|| v == "rw",
             message: 'Provided type is invalid.'
            }    
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('InviteQuestionaire', InviteQuestionaireSchema);