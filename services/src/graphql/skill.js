const typeDef = `
  type Skill {
    name: String
    user: User
    id: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input CreateSkillInput {
    name: String
    userId: String!
  }

  input UpdateSkillInput {
    name: String
    userId: String
  }

  extend type Query {
    skills: [Skill]
    skill(id: String): Skill
  }

  extend type Mutation {
    createSkill(input: CreateSkillInput!): Skill
    updateSkill(input: UpdateSkillInput!, id: String!): Skill
    deleteSkill(id: String!): Skill
  }
`

const resolvers = {
  Query: {
    skills: async (_, {}, { requester, headers }) => {
      try {
        return await requester.skillRequester({ type: 'find', headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    skill: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.skillRequester({ type: 'get', id, headers })
      } catch (e) {
        throw new Error(e)
      }
    }
  },

  Skill: {
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
    createSkill: async (_, { input = {} }, { requester, headers }) => {
      try {
        return await requester.skillRequester({ type: 'create', body: input, headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    deleteSkill: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.skillRequester({ type: 'delete', id, headers })
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