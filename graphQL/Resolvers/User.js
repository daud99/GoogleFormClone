import _, { result } from 'lodash'
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client("43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com")
const { secret } = require('../../config/variables');

var ejs = require('ejs');
const fs = require('fs');
var path = require('path');
var nodemailer = require("nodemailer");
const SiteConfig = require("../../config/site");
const EmailConfig = require("../../config/email");
const Misc = require("../../common/misc");

const Questionaire = require('../../models/QuestionaireSchema');
const Question = require('../../models/QuestionSchema');
const Answer = require('../../models/AnswerSchema');
const  User = require('../../models/User');
const auth = require("../../auth");

export const getUserQuestionaires = async (parentValue, args) => {
  return await Questionaire.find({_id: {$in: parentValue.questionaires}});
}

export const getUserQuestions = async (parentValue, args) => {
  return await Question.find({'_id': {$in: parentValue.questions}});
}

export const getUserAnswers = async (parentValue, args) => {
  return await Answer.find({'_id': {$in: parentValue.answers}});
}

export const getUserById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  let user =  await User.findOne({_id: args.id});
  user = user.toObject();
  if("password" in user) delete user.password;
  return user;
}

export const editUser = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    let result = await User.findOne({'_id': args.id});
   for (const key in args) {
     if (key !== "id") {
       result[key] = args[key];
     }
   }
    result.save();
    return {...result._doc, password: null};
  }
  catch(e) {
    console.log(e);
    throw new Error('Error while editing User');
  }
}

export const deleteUser = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    let result = await User.findOneAndRemove({$or: [
      {'_id': args.id},
      {'email': args.email},
    ]});
    result = result.toObject();
    if("password" in result) delete result.password;
    return result;
  }
  catch(e) {
    throw new Error('Error while deleting User');
  }
};

export const addUser = async (parentValue, args) => {
  try {
    var u = await User.findOne({email: args.email});
    if(u) {
      return new Error('User exist already');
    }
    var hash_password = await bcrypt.hash(args.password, 12);
    var token = Misc.makeID(32);
    const user = new User({
      email: args.email,
      name: args.name,
      password: hash_password,
      type: "user",
      age: args.age,
      resetPasswordToken: token
    })
    await user.save(); 
    var template = fs.readFileSync(path.join('emails', 'notification.htm'), 'utf-8');

    var emailHTML = ejs.render(template, {
        siteURL: `${SiteConfig.url}:${SiteConfig.port}/verify-user?token=${user.resetPasswordToken}`,
        action: 'To verify account, click the following link:',
        btnText: 'Account Verification',
        message: 'If you do not signed up on our site,you can ignore and delete this email.'
    });
   

    try {
    
        let transporter = nodemailer.createTransport({
            host: EmailConfig.host,
            port: EmailConfig.port,
            secure: EmailConfig.secure,
            auth: {
                user: EmailConfig.username,
                pass: EmailConfig.password
            }
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            to: user.email, // list of receivers
            subject: "Password Recovery", // Subject line
            html: emailHTML // html body
        });

        if(info.accepted.length <= 0) {
          return {msg: "Email for verification sent successfully"};
        }

    } catch(e) {
        throw new Error('Error while sending verification email');
    }

      return {...user._doc, password: null, resetPasswordToken: null};
    }
    catch(e) {
      console.log(e);
      throw new Error('Error while adding User');
    }
}

export const login = async (parentValue, args) => {
  try {
    const u = await User.findOne({email: args.email});
    if(!u){
      return new Error("User doesn't exist!");
    }
    if(!u.verify) {
      return new Error("Kindly verify your email");
    }
    const isEqual = await bcrypt.compare(args.password, u.password);
    if(!isEqual) {
      return new Error("Password isn't correct!");
    }
    // Second argument is a string which we are using to hash the token some one that know this key will only be able to validate your token
    const token = jwt.sign({userId: u.id, email: u.email}, secret, {
      expiresIn: '24h'
    });
    return {
      userId: u.id, token: token, tokenExpiration: 1, email: u.email, type: u.type, name: u.name
    }
  }
  catch(e) {
    console.log(e);
    throw new Error('Error while logging in');
  }
};

export const googleLogin = async (parentValue, args) => {
  try {
    const tokenID=args.tokenID;
    const response = await client.verifyIdToken({idToken:tokenID , audience: "43580613435-jloen18vc3cg889doto8tm70ss6q1rsu.apps.googleusercontent.com"});
    const paylod=response.payload;
    if(paylod.email_verified){
    const user =  await User.findOne({email:paylod.email});
      if(user){
        var token = jwt.sign({userId: user._id}, secret,{ expiresIn: '1h'});
        return {
          userId: user._id, token: token, tokenExpiration: 1, email: user.email, type: user.type, name: user.name, photo: user.photo, createdAt: user.createdAt
        }
      }
      else {
          let newUser= new User({name:paylod.given_name+" "+paylod.family_name, email:paylod.email, photo:paylod.picture, password:paylod.email+secret, tokedid:tokenID});
          let user = await newUser.save();
          var token = jwt.sign({_id: user._id},secret,
          { expiresIn: '24h' });
          return {
            userId: user._id, token: token, tokenExpiration: 1, email: user.email, type: user.type, name: user.name, photo: user.photo, createdAt: user.createdAt
          }
      }
    }
  }
  catch(e) {
    console.log(e);
    throw new Error('Error while logging in');
  }
 
};

export const sendRecoveryEmail = async (parentValue, args) => {
        
  var user = await User.findOne({
      email: args.email,
  }).exec();

  if(!user) {
    return new Error('Error no user found for given email');
  }

  var token = Misc.makeID(32);
  
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  var template = fs.readFileSync(path.join('emails', 'notification.htm'), 'utf-8');

  var emailHTML = ejs.render(template, {
      siteURL: `${SiteConfig.url}:${SiteConfig.port}/reset-password?token=${user.resetPasswordToken}`,
      action: 'To reset the password, click the following link:',
      btnText: 'Reset Password',
      message: 'If you do not requested the password change,you can ignore and delete this email'
  });

  try {
  
      let transporter = nodemailer.createTransport({
          host: EmailConfig.host,
          port: EmailConfig.port,
          secure: EmailConfig.secure,
          auth: {
              user: EmailConfig.username,
              pass: EmailConfig.password
          }
      });
      
      // send mail with defined transport object
      let info = await transporter.sendMail({
          to: user.email, // list of receivers
          subject: "Password Recovery", // Subject line
          html: emailHTML // html body
      });

      if(info.accepted.length > 0) {
        return {msg: "Email for recovery sent successfully"};
      }

  } catch(e) {
      throw new Error('Error while sending recovery email');
  }

}

export const updateRecoverPassword = async (parentValue, args) => {

  if(!args.token) {
      return new Error("Token required for recovery.");
  }

  var user = await User.findOne({ resetPasswordToken: args.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
  
  if(!user) {
    return new Error("Could not find active user by the token.");
  }

  user.password = await this.hashPassword(args.newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.save();
  
  return {msg: "Your password is reset successfully"};
}

export const verifyUser = async (parentValue, args) => {

  if(!args.token) {
      return new Error("Token required for recovery.");
  }

  var user = await User.findOne({ resetPasswordToken: args.token }).exec();
  
  if(!user) {
    return new Error("Could not find active user by the token.");
  }

  user.verify = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.save();
  
  return {msg: "User is verified successfully"};
}

