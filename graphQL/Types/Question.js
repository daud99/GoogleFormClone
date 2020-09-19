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
import * as questionaireResolvers from '../Resolvers/Questionaire'
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
            type: GraphQLNonNull(GraphQLString)
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
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return questionResolvers.getQuestionUser(parentValue, args)
            }
        }
    })
})

export { QuestionType as default }