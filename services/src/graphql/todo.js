const typeDef = `
type Todo {
  title: String
  isDone: Boolean
  user: User
  id: String
  createdAt: DateTime
  updatedAt: DateTime
}

input CreateTodoInput {
  title: String
  isDone: Boolean
  userId: String!
}

input UpdateTodoInput {
  title: String
  isDone: Boolean
  userId: String
}

extend type Query {
  todos: [Todo]
  todo(id: String): Todo
}

extend type Mutation {
  createTodo(input: CreateTodoInput!): Todo
  updateTodo(input: UpdateTodoInput!, id: String!): Todo
  deleteTodo(id: String!): Todo
}
`

const resolvers = {
  Query: {
    todos: async (_, {}, { requester, headers }) => {
      try {
        return await requester.todoRequester({ type: 'find', headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    todo: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.todoRequester({ type: 'get', id, headers })
      } catch (e) {
        throw new Error(e)
      }
    },
  },
  Todo: {
    user: async ({ userId }, args, { headers, requester }) => {
      try {
        if (!userId) return null
        const data = await requester.userRequester({ type: 'get', id: userId, headers })
        if (!data) {
          return null
        }
        return data
      } catch (e) {
        throw new Error(e)
      }
    },
  },
  Mutation: {
    createTodo: async (_, { input = {} }, { requester, headers }) => {
      try {
        return await requester.todoRequester({ type: 'create', body: input, headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    deleteTodo: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.todoRequester({ type: 'delete', id, headers })
      } catch (e) {
        throw new Error(e)
      }
    },
  }
}

module.exports = {
  typeDef,
  resolvers
}