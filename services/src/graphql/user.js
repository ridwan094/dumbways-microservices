const typeDef = `
type User {
  id: String
  email: String
  password: String
  name: String
  phone: String
  role: Role
  profile: Profile
  skills: [Skill]
  todos: [Todo]
  createdAt: DateTime
  updatedAt: DateTime
}

type Login {
  token: String
  user: User
}

enum RegisterRole {
  PARTNER
  USER
}

input RegisterInput {
  email: String!
  password: String!
  name: String
  phone: String
  role: RegisterRole
  profile: CreateProfileInput
  skills: [CreateSkillInput]
}

input UpdateUserInput {
  email: String
  password: String
  name: String
  phone: String
  role: Role
  profile: UpdateProfileInput
  skills: [UpdateSkillInput]
}

input LoginInput {
  email: String!
  password: String
}

extend type Query {
  users: [User]
  user(id: String): User
}

extend type Mutation {
  login(input: LoginInput): Login
  register(input: RegisterInput): Login
  updateUser(input: UpdateUserInput, id: String!): User
  deleteUser(id: String!): User
}
`

const resolvers = {
  Query: {
    users: async (_, {}, { requester, headers }) => {
      try {
        return await requester.userRequester({ type: 'find', headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    user: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.userRequester({ type: 'get', id, headers })
      } catch (e) {
        throw new Error(e)
      }
    }
  },

  User: {
    profile: async ({ profileId }, _, { requester, headers }) => {
      try {
        if(!profileId) return null
        const data = await requester.profileRequester({ type: 'get', id: profileId, headers })
        if (!data) return null
        return data
      } catch (e) {
        throw new Error(e)
      }
    },
    skills: async ({ id }, _, { requester, headers }) => {
      try {
        const data = await requester.skillRequester({ type: 'find', headers })
        return data.filter(d => d.userId == id)
      } catch (e) {
        throw new Error(e)
      }
    },
    todos: async ({ id }, _, { requester, headers }) => {
      try {
        const data = await requester.todoRequester({ type: 'find', headers })
        return data.filter(d => d.userId == id)
      } catch (e) {
        throw new Error(e)
      }
    },
  },

  Mutation: {
    register: async (_, { input }, { requester }) => {
      try {
        return await requester.userRequester({ type: "register", body: input });
      } catch (e) {
        throw new Error(e)
      }
    },
    login: async (_, { input }, { requester }) => {
      try {
        return await requester.userRequester({ type: "login", body: input });
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