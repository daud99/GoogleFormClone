const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} = graphql

import QuestionaireType from './Questionaire'
import UserType from './User'
import * as questionResolvers from '../Resolvers/Question'

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString)
        },
        question: {
            type: GraphQLNonNull(GraphQLString)
        },
        category: {
            type: GraphQLString
        },
        likes: {
            type: GraphQLInt,
            defaultValue: 0
        },
        dislikes: {
            type: GraphQLInt,
            defaultValue: 0
        },
        questionaire: {
            type: QuestionaireType,
            resolve(parentValue, args) {
                return questionResolvers.getQuestionQuestionaire(parentValue, args)
            }
        },
        createdAt:{
            type: GraphQLString
          },
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return questionResolvers.getQuestionUser(parentValue, args)
            }
        }
    })
})

export { QuestionType as default }