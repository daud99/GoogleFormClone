const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} = graphql

const AuthData = new GraphQLObjectType({
    name: "AuthData",
    fields: () => ({
      userId: {
        type: GraphQLNonNull(GraphQLString)
      },
      token: {
        type: GraphQLNonNull(GraphQLString)
      },
      tokenExpiration: {
        type: GraphQLInt
      },
      email: {
        type: GraphQLNonNull(GraphQLString)
      },
      name: {
        type: GraphQLNonNull(GraphQLString)
      },
      type: {
        type: GraphQLNonNull(GraphQLString)
      },
      photo: {
        type: GraphQLString
      },
      createdAt: {
        type: GraphQLString
      }
    })
  });

  export { AuthData as default }