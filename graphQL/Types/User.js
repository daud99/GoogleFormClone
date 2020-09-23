const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = graphql

import QuestionaireType from './Questionaire'
import QuestionType from './Question'
import AnswerType from './Answer'
import * as userResolvers from '../Resolvers/User'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString)
    },
    name: {
      type: GraphQLNonNull(GraphQLString)
    },
    email: {
      type: GraphQLNonNull(GraphQLString)
    },
    type: {
      type: GraphQLNonNull(GraphQLString)
    },
    age: {
      type: GraphQLInt
    },
    photoURL: {
      type: GraphQLString
    },
    password: {
      type: GraphQLNonNull(GraphQLString)
    },
    _id: {
      type: GraphQLString
    },
    archived: {
      type: GraphQLBoolean,
      defaultValue: false
    },
    updatedAt:{
      type:GraphQLString
    },
    // tokens: [Token]
    questionaires: {
      type: new GraphQLList(QuestionaireType),
      resolve (parentValue, args) {
        return userResolvers.getUserQuestionaires(parentValue, args)
      }
    },
    questions: {
      type: new graphql.GraphQLList(QuestionType),
      resolve(parentValue, args) {
        return userResolvers.getUserQuestions(parentValue, args);
      }
    },
    answers: {
      type: new graphql.GraphQLList(AnswerType),
      resolve(parentValue, args) {
        return userResolvers.getUserAnswers(parentValue, args);
      }
    }
    // questions: [Question!]!
  })
})

export { UserType as default }