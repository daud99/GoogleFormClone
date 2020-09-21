const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString
} = graphql

import QuestionaireType from './Questionaire'
import UserType from './User'
import * as questionResolvers from '../Resolvers/Question'

const InviteQuestionaireType = new GraphQLObjectType({
    name: 'InviteQuestionaire',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLString)
        },
        invitedUserEmail: {
            type: GraphQLNonNull(GraphQLString)
        },
        status: {
            type: GraphQLString
        },
        permission: {
            type: GraphQLString
        },
        questionaire: {
            type: QuestionaireType,
            resolve(parentValue, args) {
                return inviteQuestionarieResolvers.getInviteQuestionaireQuestionaire(parentValue, args)
            }
        },
        senderId: {
            type: UserType,
            resolve(parentValue, args) {
                return inviteQuestionarieResolvers.getInviteQuestionaireSender(parentValue, args)
            }
        },
        receiverId: {
            type: UserType,
            resolve(parentValue, args) {
                return inviteQuestionarieResolvers.getInviteQuestionaireReceiver(parentValue, args)
            }
        }
    })
})

export { InviteQuestionaireType as default }