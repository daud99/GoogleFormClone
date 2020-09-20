import _ from 'lodash'
var ejs = require('ejs');
const fs = require('fs');
var path = require('path');
var nodemailer = require("nodemailer");
const SiteConfig = require("../../config/site");
const EmailConfig = require("../../config/email");

const Questionaire = require('../../models/QuestionaireSchema');
const  User = require('../../models/User');
const  Question = require('../../models/QuestionSchema');
const  Answer = require('../../models/AnswerSchema');

const auth = require("../../auth");

export const getOwnerQuestionaire = async (parentValue, args) => {
  let user = await User.findOne({'_id': parentValue.user});
  user = user.toObject();
  if("password" in user) delete user.password;
  return user;
}
export const getQuestionaireOfOwner = async (parentValue, args) => {
  return await Questionaire.find({owner: args.owner});
}
export const getQuestionaireQuestions = async (parentValue, args) => {
  return await Question.find({'_id': {$in: parentValue.questions}});
}

export const getQuestionarieAnswers = async (parentValue, args) => {
  return await Answer.find({'_id': {$in: parentValue.answers}});
}

export const getAllQuestionaire = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdmin(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  if(args.category) {
    return await Questionaire.find({category: args.category});
  }
  return await Questionaire.find({});
}

export const getQuestionaireById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  const questionaire = await Questionaire.findOne({_id: args.id});
  const user = await User.findOne({_id: req.userId})
  if(questionaire) {
    if(questionaire.owner === req.userId || questionaire.read.includes(user.email)) {
      return questionaire;
    } else {
      throw new Error("You do not have permission to view this questionaire");
    }
  } else {
    throw new Error("Questionaire not found");
  }
}

export const editQuestionaire = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    let result = await Questionaire.findOne({'_id': args.id});
    for (const key in args) {
      if (key !== "id") {
        result[key] = args[key];
      }
    }
    result.save();
    return result;
  }
  catch(e) {
    console.log(e);
    throw new Error('Error while editing Questionaire');
  }
};

export const deleteQuestionaire = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    let result = await Questionaire.findOneAndRemove({'_id': args.id});
    return result;
  }
  catch(e) {
    throw new Error('Error while deleting Questionaire');
  }
};

export const deleteAllQuestionaires = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdmin(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    let result = await Questionaire.remove({'title': args.title});
    return result;
  }
  catch(e) {
    throw new Error('Error while deleting Questionaire');
  }
};

export const addNewQuestionaire = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    const userExists = await User.exists({
      _id: args.owner
    });
  
    let questionaire = new Questionaire({
      title: args.title,
      category: args.category,
      owner: args.owner,
      upVote: args.upVote,
      downVote: args.downVote,
      backgroundImage: args.backgroundImage,
      backgroundColor: args.backgroundColor,
      backgroundVideo: args.backgroundVideo,
      questions: args.questions,
      answers: args.answers
    });
  
    return await questionaire.save();
  } catch(e) {
    throw new Error('Error while adding new Questionaire');
  }
}

export const inviteUser = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    const questionaire = await Questionaire.findOne({_id: args.questionaireId});
    if(questionaire) {
      if(questionaire._id === req.userId) {
        if(!questionaire.write.includes(args.email))
        { 
          questionaire.write.push(args.email);
        }
      } 
      if(!questionaire.read.includes(args.email))
      { 
        questionaire.read.push(args.email);
      }
      await questionaire.save();
      // G:/projects/GoogleFormClone/emails/invite-user.htm
      var template = fs.readFileSync(path.join('emails', 'invite-user.htm'), 'utf-8');

        var emailHTML = ejs.render(template, {
            siteURL: SiteConfig.url
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
              to: args.email, // list of receivers
              subject: "Invitation to fill the form", // Subject line
              html: emailHTML // html body
          });
  
          if(info.accepted.length > 0) {
            return {msg: "User is invited successfully"};
          }

      } catch(e) {
          console.log(e);
          return {msg: "Something went wrong while inviting the user"};

      }
    } else {
      throw new Error("Questionaire doesn't exist");
    }
  } catch(e) {
    console.log(e);
    throw new Error('Error while inviting user for questionaire');
  }
}