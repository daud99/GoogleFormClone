import _ from 'lodash'
var ejs = require('ejs');
const fs = require('fs');
var path = require('path');
var nodemailer = require("nodemailer");
const SiteConfig = require("../../config/site");
const EmailConfig = require("../../config/email");
const Questionaire = require('../../models/QuestionaireSchema');
const InviteQuestionaire = require('../../models/InviteQuestionaireSchema');
const Question = require('../../models/QuestionSchema');
const Answer = require('../../models/AnswerSchema');
const  User = require('../../models/User');

const auth = require("../../auth");

export const getQuestionaireOwner = async (parentValue, args) => {
  let user = await User.findOne({'_id': parentValue.owner});
  if(user) {
    return {...user._doc, password: null};
  } else {
    throw new Error("No user found");
  }

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
    return await Questionaire.find({});
  }
  return await Questionaire.find({});
}

export const getQuestionaireById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  const questionaire = await Questionaire.findOne({_id: args.id});
  // if(questionaire) {
  //   if(questionaire.owner == req.userId) {
  //     return questionaire;
  //   } else {
  //     throw new Error("You do not have permission to view this questionaire");
  //   }
  // } else {
  //   throw new Error("Questionaire not found");
  // }
  return questionaire;
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
    if(result) {
      await Question.deleteMany({'questionaire': result._id});
      await Answer.deleteMany({'questionaire': result._id});
      await InviteQuestionaire.deleteMany({'questionaire': result._id});
      let users = await User.find(
        {questionaires: {
        $elemMatch: {
          $eq: result._id
          }
        }
      });
      for(var i in users) {
        users[i].questionaires.remove(result._id);
        await users[i].save();
      }
    }
    return result;
  }
  catch(e) {
    console.log(e);
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
  console.log(req.userId)
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {

    let questionaire = new Questionaire({
      title: args.title,
      category: args.category,
      owner: args.owner,
      upVote: args.upVote,
      downVote: args.downVote,
      backgroundImage: args.backgroundImage,
      backgroundColor: args.backgroundColor,
      backgroundVideo: args.backgroundVideo
    });
    questionaire = await questionaire.save();
    const user = await User.findOne({_id: args.owner});
    if(user) {
      user.questionaires.push(questionaire._id);
      await user.save();
    } else {
      throw new Error('No such user exist for given owner');
    }
    return questionaire;
  } catch(e) {
    console.log(e);
    throw new Error('Error while adding new Questionaire');
  }
}

export const alertOwnerOnQuestionaireFill = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  try {
    const questionaire = await Questionaire.findOne({_id: args.questionaireId});
    if(!(questionaire.owner == req.userId)) {
      var template = fs.readFileSync(path.join('emails', 'notification.htm'), 'utf-8');
      
      var emailHTML = ejs.render(template, {
          siteURL: `${SiteConfig.url}:${SiteConfig.port}/login`,
          message: `The ${args.email} user has filled the form ${questionaire.title}`,
          action: 'To open our site, click the following link:',
          btnText: 'Open Website'
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
            subject: "A new response to questionaire", // Subject line
            html: emailHTML // html body
        });

        if(info.accepted.length > 0) {
          return {msg: "The owner of questionaire is informed successfully"};
        }

    } catch(e) {
        console.log(e);
        return {msg: "Something went wrong while informaing the owner of questionar"};

      }
    } else {
      return {msg: "No need to alert the owner"};
    }

  } catch(e) {
    console.log(e);
    throw new Error('Error while alerting user for questionaire completion');
  }
}
