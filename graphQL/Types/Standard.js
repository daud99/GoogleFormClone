const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString
} = graphql

const Standard = new GraphQLObjectType({
    name: "Standard",
    fields: () => ({
      msg: {
        type: GraphQLString
      }
    })
  });

  export { Standard as default }