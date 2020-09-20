const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = graphql

import UserType from './User'
import QuestionType from './Question'
import AnswerType from './Answer'

import * as questionaireResolvers from '../Resolvers/Questionaire'

const QuestionaireType = new GraphQLObjectType({
  name: 'Questionaire',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLString)
    },
    title: {
      type: GraphQLNonNull(GraphQLString)
    },
    category: {
      type: GraphQLNonNull(GraphQLString)
    },
    createdAt:{
      type: GraphQLString
    },
    upVote: {
      type: GraphQLInt,
      defaultValue: 0
    },
    downVote: {
      type: GraphQLInt,
      defaultValue: 0
    },
    views: {
      type: GraphQLInt,
      defaultValue: 0
    },
    backgroundImage: {
      type: GraphQLString
    },
    backgroundColor: {
      type: GraphQLString
    },
    backgroundVideo: {
      type: GraphQLString
    },
    write: {
      type: graphql.GraphQLList(graphql.GraphQLString)
    },
    read: {
      type: graphql.GraphQLList(graphql.GraphQLString)
    },
    owner: {
      type: UserType,
      resolve(parentValue, args) {
        return questionaireResolvers.getOwnerQuestionaire(parentValue, args)
      }
    },
    questions: {
      type: new graphql.GraphQLList(QuestionType),
      resolve(parentValue, args) {
        return questionaireResolvers.getQuestionaireQuestions(parentValue, args);
      }
    },
    answers: {
      type: new graphql.GraphQLList(AnswerType),
      resolve(parentValue, args) {
        return questionaireResolvers.getQuestionarieAnswers(parentValue, args);
      }
    }
  })
})

export { QuestionaireType as default }