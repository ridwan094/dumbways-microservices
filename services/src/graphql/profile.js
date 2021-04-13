const typeDef = `
type Profile {
  address: String
  latestEducation: String
  user: User
  id: String
  createdAt: DateTime
  updatedAt: DateTime
}

input CreateProfileInput {
  address: String
  latestEducation: String
  userId: String!
}

input UpdateProfileInput {
  address: String
  latestEducation: String
  userId: String
}

extend type Query {
  profiles: [Profile]
  profile(id: String): Profile
}

extend type Mutation {
  createProfile(input: CreateProfileInput!): Profile
  updateProfile(input: UpdateProfileInput!, id: String!): Profile
  deleteProfile(id: String!): Profile
}
`

const resolvers = {
  Query: {
    profiles: async (_, {}, { requester, headers }) => {
      try {
        return await requester.profileRequester({ type: 'find', headers })
      } catch (e) {
        throw new Error(e)
      }
    },
    profile: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.profileRequester({ type: 'get', id, headers })
      } catch (e) {
        throw new Error(e)
      }
    },
  },
  Profile: {
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
    createProfile: async (_, { input = {} }, { requester, headers }) => {
      try {
        const data = await requester.profileRequester({ type: 'create', body: input, headers })
        await requester.userRequester({ type: 'update', id: data.userId, body: { profileId: data.id } })
        return data
      } catch (e) {
        throw new Error(e)
      }
    },
    deleteProfile: async (_, { id }, { requester, headers }) => {
      try {
        return await requester.profileRequester({ type: 'delete', id, headers })
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