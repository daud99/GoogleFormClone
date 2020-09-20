import _ from 'lodash'
const Question = require('../../models/QuestionSchema');
const Answer = require('../../models/AnswerSchema');
const Questionaire = require('../../models/QuestionaireSchema');
const User = require('../../models/User');
const auth = require("../../auth");

export const getQuestionQuestionaire = async (parentValue, args) => {
  return await Questionaire.findOne({'_id': parentValue.questionaire});
}

export const getQuestionUser = async (parentValue, args) => {
  let user = await User.findOne({'_id': parentValue.user});
  user = user.toObject();
  if("password" in user) delete user.password;
  return user;
}

export const getQuestionAnswer = async (parentValue, args) => {
  return await Answer.findOne({'_id': parentValue.answer});
}

export const getQuestionById = async (parentValue, args, req) => {
  const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
  if(request_invalid) {
    throw request_invalid;
  }
  return await Question.findOne({_id: args.id});
}

export const addNewQuestion = async (parentValue, args, req) => {
    // const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    // if(request_invalid) {
    //   throw request_invalid;
    // }
    try {
    
      let question = new Question({
        question: args.question,
        category: args.category,
        likes: args.likes,
        dislikes: args.dislikes,
        questionaire: args.questionaire,
        answer: args.answer,
        user: args.user
      });
      
      
      question = await question.save();

      const questionaire = await Questionaire.findOne({_id: args.questionaire});
      if(questionaire) {
        questionaire.questions.push(question._id);
        await questionaire.save();
      } else {
        throw new Error("Error no questionaire with given questionaire id");
      }

      return question;


    } catch(e) {
      console.log(e);
      throw new Error('Error while adding new Question');
    }
  };

  export const editQuestion = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Question.findOne({'_id': args.id});
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
      throw new Error('Error while editing Question');
    }
  };
  
  export const deleteQuestion = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Question.findOneAndRemove({$or: [
        {'_id': args.id},
        {'question': args.question},
      ]});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting Question');
    }
  };
  
  export const deleteAllQuestions = async (parentValue, args, req) => {
    const request_invalid = await auth.isSuperAdminOrAdminOrUser(req.isAuth, req.userId);
    if(request_invalid) {
      throw request_invalid;
    }
    try {
      let result = await Question.remove({'question': args.question});
      return result;
    }
    catch(e) {
      throw new Error('Error while deleting all Questions');
    }
  };
  