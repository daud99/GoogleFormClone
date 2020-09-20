import _ from 'lodash'
const Answer = require('../../models/AnswerSchema');
const Question = require('../../models/QuestionSchema');
const Questionaire = require('../../models/QuestionaireSchema');
const User = require('../../models/User');
const auth = require("../../auth");


export const getAnswerQuestionaire = async (parentValue, args) => {
  return await Questionaire.findOne({'_id': parentValue.questionaire});
}
export const getAnswerUser = async (parentValue, args) => {
  let user = await User.findOne({'_id': parentValue.user});
  user = user.toObject();
  if("password" in user) delete user.password;
  return user;
}
export const getAnswerQuestion = async (parentValue, args) => {
  return await Question.findOne({'_id': parentValue.question});
}

export const getAnswerById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  return await Answer.findOne({_id: args.id});
}

export const getAnswerByUserAndQuestionaire = async (parentValue, args, req) => {
  // const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  // if(request_invalid) {
  //   throw request_invalid;
  // }
  return await Answer.find({user: args.user, questionaire: args.questionaire});
}

export const addNewAnswer = async (parentValue, args, req) => {
    // const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    // if(request_invalid) {
    //   throw request_invalid;
    // }
    try {
      let answer = await Answer.findOne({
        user: args.user,
        question: args.question,
        questionaire: args.questionaire
      });
     
      if(answer) {
        answer.answer = args.answer;
      } else {
        answer = new Answer({
          answer: args.answer,
          likes: args.likes,
          dislikes: args.dislikes,
          questionaire: args.questionaire,
          question: args.question,
          user: args.user
        });
        const questionaire = await Questionaire.findOne({_id: args.questionaire});
        if(questionaire) {
          questionaire.answers.push(answer._id);
          await questionaire.save();
        } else {
          throw new Error("Error no questionaire with given questionaire id");
        }
      }
      return await answer.save();      
    } catch(e) {
      console.log(e);
      throw new Error('Error while adding new Answer');
    }
  };

  export const editAnswer = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Answer.findOne({'_id': args.id});
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
      throw new Error('Error while editing Answer');
    }
  };
  
  export const deleteAnswer = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Answer.findOneAndRemove({$or: [
        {'_id': args.id},
        {'answer': args.answer},
      ]});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting Answer');
    }
  };
  
  export const deleteAllAnswers = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Answer.remove({'answer': args.answer});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting all Answers');
    }
  };
  