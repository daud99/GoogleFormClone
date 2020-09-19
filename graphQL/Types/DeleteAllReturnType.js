const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLInt,
} = graphql

const DeleleteAllReturnType = new GraphQLObjectType({
    name: "DeleteReturn",
    fields: () => ({
      deletedCount: {
        type: GraphQLInt
      }
    })
  });

  export { DeleleteAllReturnType as default }