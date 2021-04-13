const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server');
const { merge } = require('lodash');
const { PORT } = require('./config.json')

const { typeDef: userTypeDef, resolvers: userResolvers } = require('./graphql/user')
const { typeDef: skillTypeDef, resolvers: skillResolvers } = require('./graphql/skill')
const { typeDef: profileTypeDef, resolvers: profileResolvers } = require('./graphql/profile')
const { typeDef: todoTypeDef, resolvers: todoResolvers } = require('./graphql/todo')

// requester
const userRequester = require('./requester')('user');
const profileRequester = require('./requester')('profile');
const skillRequester = require('./requester')('skill');
const todoRequester = require('./requester')('todo');

const context = ({req, res}) => {
  return {
    headers: { Authorization: req.headers.authorization || "" },
    requester: {
      userRequester,
      profileRequester,
      skillRequester,
      todoRequester
    },
    resolvers: {
      userResolvers,
      profileResolvers,
      skillResolvers,
      todoResolvers
    }
  }
}

const typeDefs = gql `
  type Query { default: String }
  type Mutation { default: String }

  enum Role {
    ADMIN
    PARTNER
    USER
  }

  scalar DateTime
`

const resolvers = {}

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, userTypeDef, skillTypeDef, profileTypeDef, todoTypeDef],
  resolvers: merge(resolvers, userResolvers, profileResolvers, skillResolvers, todoResolvers)
})

const apolloServer = new ApolloServer({ 
  schema,
  context
});

// The `listen` method launches a web server.
apolloServer.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});