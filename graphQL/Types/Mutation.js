const graphql = require('graphql')
const {
  GraphQLObjectType
} = graphql

import UserType from './User'
import QuestionaireType from './Questionaire'
import * as userResolvers from '../Resolvers/User'
import * as questionaireResolvers from '../Resolvers/Questionaire'
import AnswerType from './Answer'
import QuestionType from './Question'
import DeleleteAllReturnType from './DeleteAllReturnType'
import StandardType from './Standard'
import * as answerResolvers from '../Resolvers/Answer'
import * as questionResolvers from '../Resolvers/Question'



const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: ({
    addUser: {
      type: UserType,
      args: {
        name: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        age: {
          type: graphql.GraphQLInt
        }
      },
      resolve(parentValue, args) {
        return userResolvers.addUser(parentValue, args);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        name: {
          type: graphql.GraphQLString
        },
        email: {
          type: graphql.GraphQLString,
        },
        type: {
          type: graphql.GraphQLString,
        },
        age: {
          type: graphql.GraphQLInt
        },
        photoURL: {
          type: graphql.GraphQLString
        },
        archived: {
          type: graphql.GraphQLBoolean
        }
      },
      resolve(parentValue, args, req) {
        return userResolvers.editUser(parentValue, args, req);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id:{
          type: graphql.GraphQLString
        },
        email: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return userResolvers.deleteUser(parentValue, args, req);
      }
    },
    addQuestionaire: {
      type: QuestionaireType,
      args: {
        title: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        category: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        upVote: {
          type: graphql.GraphQLInt
        },
        downVote: {
          type: graphql.GraphQLInt
        },
        backgroundImage: {
          type: graphql.GraphQLString
        },
        backgroundColor: {
          type: graphql.GraphQLString
        },
        backgroundVideo: {
          type: graphql.GraphQLString
        },
        owner: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return questionaireResolvers.addNewQuestionaire(parentValue, args, req)
      }
    },
    editQuestionaire: {
      type: QuestionaireType,
      args: {
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        title: {
          type: graphql.GraphQLString
        },
        category: {
          type: graphql.GraphQLString
        },
        upVote: {
          type: graphql.GraphQLInt
        },
        downVote: {
          type: graphql.GraphQLInt
        },
        views: {
          type: graphql.GraphQLInt
        },
        backgroundImage: {
          type: graphql.GraphQLString
        },
        backgroundColor: {
          type: graphql.GraphQLString
        },
        backgroundVideo: {
          type: graphql.GraphQLString
        },
        owner: {
          type: graphql.GraphQLString
        }
      },
      resolve(parentValue, args, req) {
        return questionaireResolvers.editQuestionaire(parentValue, args, req);
      }
    },
    deleteQuestionaire: {
      type: QuestionaireType,
      args: {
        id:{
          type: graphql.GraphQLString
        }
      },
      resolve(parentValue, args, req){
        return questionaireResolvers.deleteQuestionaire(parentValue, args, req);
      }
    },
    deleteAllQuestionaires: {
      type: DeleleteAllReturnType,
      args: {
        title: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return questionaireResolvers.deleteAllQuestionaires(parentValue, args, req);
      }
    },
    inviteUserToFillQuestionaire: {
      type: StandardType,
      args: {
        email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)       
        },
        questionaireId: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        permission: {
          type: graphql.GraphQLString
        }
      },
      resolve(parentValue, args, req){
        return questionaireResolvers.inviteUser(parentValue, args, req);
      }
    },
    addQuestion: {
      type: QuestionType,
      args: {
        question: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        category: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        likes: {
          type: graphql.GraphQLInt
        },
        dislikes: {
          type: graphql.GraphQLInt
        },
        user: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        questionaire: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        // answer: {
        //   type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        // }
      },
      resolve(parentValue, args, req) {
        return questionResolvers.addNewQuestion(parentValue, args, req)
      }
    },
    editQuestion: {
      type: QuestionType,
      args: {
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        question: {
          type: graphql.GraphQLString
        },
        category: {
          type: graphql.GraphQLString
        },
        likes: {
          type: graphql.GraphQLInt
        },
        dislikes: {
          type: graphql.GraphQLInt
        },
        user: {
          type: graphql.GraphQLString
        },
        questionaire: {
          type: graphql.GraphQLString
        },
        // answer: {
        //   type: graphql.GraphQLString
        // }
      },
      resolve(parentValue, args, req) {
        return questionResolvers.editQuestion(parentValue, args, req)
      }
    },
    deleteQuestion: {
      type: QuestionType,
      args: {
        id:{
          type: graphql.GraphQLString
        },
        question: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return questionResolvers.deleteQuestion(parentValue, args, req);
      }
    },
    deleteAllQuestions: {
      type: DeleleteAllReturnType,
      args: {
        question: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return questionResolvers.deleteAllQuestions(parentValue, args, req);
      }
    },
    addAnswer: {
      type: AnswerType,
      args: {
        answer: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        category: {
          type: graphql.GraphQLString
        },
        likes: {
          type: graphql.GraphQLInt
        },
        dislikes: {
          type: graphql.GraphQLInt
        },
        user: {
          type: graphql.GraphQLString
        },
        questionaire: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        question: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return answerResolvers.addNewAnswer(parentValue, args, req)
      }
    },
    editAnswer: {
      type: AnswerType,
      args: {
        id:{
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        answer: {
          type: graphql.GraphQLString
        },
        category: {
          type: graphql.GraphQLString
        },
        likes: {
          type: graphql.GraphQLInt
        },
        dislikes: {
          type: graphql.GraphQLInt
        },
        user: {
          type: graphql.GraphQLString
        },
        questionaire: {
          type: graphql.GraphQLString
        },
        question: {
          type: graphql.GraphQLString
        }
      },
      resolve(parentValue, args, req) {
        return answerResolvers.editAnswer(parentValue, args, req)
      }
    },
    deleteAnswer: {
      type: AnswerType,
      args: {
        id:{
          type: graphql.GraphQLString
        },
        answer: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return answerResolvers.deleteAnswer(parentValue, args, req);
      }
    },
    deleteAllAnswers: {
      type: DeleleteAllReturnType,
      args: {
        answer: {
          type: graphql.GraphQLString       
        }
      },
      resolve(parentValue, args, req){
        return answerResolvers.deleteAllAnswers(parentValue, args, req);
      }
    }
  })
})

export { mutation as default }