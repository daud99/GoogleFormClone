const graphql = require('graphql')

import query from './Types/Query'
import mutation from './Types/Mutation'

const schema = new graphql.GraphQLSchema({
  query,
  mutation
})

export { schema as default }