const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    creator: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    password: String!
    status: String!
    posts: [Post!]!
  }

  input UserData {
    email: String!
    name: String!
    status: Boolean!
    password: String!
  }

  type testData {
    text: String!
    views: Int!
  }

  type RootQuery {
    hello: testData!
  }

  type RootMutation {
    createUser(userInput: UserData): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
