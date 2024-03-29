const mongoose = require('mongoose');
const _ = require("lodash");
const jwt = require('jsonwebtoken');

// Local imports
const { JWTsecret } = require('../config/variables');

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: false
  },
  verify: {
    type: Boolean,
    default: false,
    required: false
  },
  email: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    required:true
  },
  age: {
    type: Number
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
      type: Date,
  },
  type: {
    type: String,
    required: true,
    validate: {
        validator: (v) => v == "super-admin" || v == "admin"|| v == "user",
        message: 'Provided type is invalid.'
    },
    default:"user"
  },
  createdAt:{
    type:Date,
    default:Date.now()
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  questionaires:[
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Questionaire'
    }
  ],
  questions: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Question'
    }
  ],
  answers: [
      { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Answer'
     }
  ]
}, {
  timestamps: true,
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  var picked = _.pick(userObject,
    [
      '_id',
      'name',
      'email',
      'photo',
      'type',
      'questionaires',
      'questions',
      'answers',
      'createdAt'
    ]);

  return picked;
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
      _id: user._id.toHexString(),
      access
    },
    JWTsecret,
    // { expiresIn: '24h' // expires in 24 hours
    // }
  ).toString();
  // console.log(token);
  // user.tokens.concat([{access, token}]);
  user.tokens.push({
    access,
    token
  });

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.updateOne({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

UserSchema.methods.removeAllTokens = function () {
  var user = this;
  return user.updateOne({
    tokens: []
  },
  { new: true });
};

UserSchema.statics.findByToken = async function (token) {
  if (token.startsWith('bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.reject(e);
  }

  return await User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  });
};

UserSchema.statics.findByEmail = function (email) {
  var User = this;

  return User.findOne({
    email
  }).then((user) => {
    // console.log(user)
    return user;
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this; //it is just a reservation of a variable, that a user would be this from a group of all the users

  return User.findOne({
    email
  }).then((user) => {
    if (!user) {
      return Promise.reject('User not found');
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      // console.log(password);
      // console.log(user.password);
      bcrypt.compare(password, user.password, (err, res) => {
        console.log(`password matches ? ${res}`);
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  next()
});

UserSchema.pre('findOneAndUpdate', function(next){
  var user = this;
  next()
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
