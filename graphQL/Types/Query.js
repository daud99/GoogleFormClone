const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = graphql

import UserType from './User'
import QuestionaireType from './Questionaire'
import AnswerType from './Answer'
import QuestionType from './Question'
import AuthDataType from './AuthData'
import StandardType from './Standard'
import * as userResolvers from '../Resolvers/User'
import * as questionaireResolvers from '../Resolvers/Questionaire'
import * as answerResolvers from '../Resolvers/Answer'
import * as questionResolvers from '../Resolvers/Question'

const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: ({
    getUserByID: {
      type: UserType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return userResolvers.getUserById(parentValue, args, req)
      }
    },
    getQuestionsOfQuestionaire: {
      type: new GraphQLList(QuestionType),
      args: {
        idp: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return questionResolvers.questionsOfQuestionaire(parentValue, args)
      }
    },
    getQuestionaireByID: {
      type: QuestionaireType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return questionaireResolvers.getQuestionaireById(parentValue, args, req)
      }
    },
    getAllQuestionaires: {
      type: new graphql.GraphQLList(QuestionaireType),
      args: {
        category: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args, req) {
        return questionaireResolvers.getAllQuestionaire(parentValue, args, req)
      }
    },
    getAnswerByID: {
      type: AnswerType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return answerResolvers.getAnswerById(parentValue, args, req)
      }
    },
    getQuestionairesOfOwner: {
      type: new GraphQLList(QuestionaireType),
      args: {
        owner: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return questionaireResolvers.getQuestionaireOfOwner(parentValue, args)
      }
    },
    getAnswerByUserAndQuestionaire: {
      type: new graphql.GraphQLList(AnswerType),
      args: {
        user: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        questionaire: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return answerResolvers.getAnswerByUserAndQuestionaire(parentValue, args, req)
      }
    },
    getQuestionByID: {
      type: QuestionType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return questionResolvers.getQuestionById(parentValue, args, req)
      }
    },
    alertOwnerOnQuestionaireFill: {
      type: StandardType,
      args: {
        questionaireId: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args, req) {
        return questionaireResolvers.alertOwnerOnQuestionaireFill(parentValue, args, req)
      }
    },
    login: {
      type: AuthDataType,
      args: {
        email: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return userResolvers.login(parentValue, args)
      }
    },
    googleLogin: {
      type: AuthDataType,
      args: {
        tokenID: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return userResolvers.googleLogin(parentValue, args)
      }
    }
  })
})

export { query as default }
