const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = graphql

import QuestionaireType from './Questionaire'
import UserType from './User'
import QuestionType from './Question'
import * as answerResolvers from '../Resolvers/Answer'
const AnswerType = new GraphQLObjectType({
    name: 'Answer',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString)
        },
        answer: {
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
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return answerResolvers.getAnswerUser(parentValue, args)
            }
        },
        questionaire: {
            type: QuestionaireType,
            resolve(parentValue, args) {
                return answerResolvers.getAnswerQuestionaire(parentValue, args)
            }
        },
        question: {
            type: QuestionType,
            resolve(parentValue, args) {
                return answerResolvers.getAnswerQuestion(parentValue, args)
            }
        },

    })
})

export { AnswerType as default }