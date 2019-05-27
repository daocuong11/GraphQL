const { gql } = require('apollo-server');

const typeDefs = gql`
type Category {
  id: ID!
  title: String!
  slug: String!
  insertedAt: String!
  updatedAt: String!
}

type Thread {
  id: ID!
  title: String!
  slug: String!
  category: Category!
  posts: [Post!]!
  insertedAt: String!
  updatedAt: String!
}

type Post {
  id: ID!
  body: String!
  thread: Thread!
  user: User!
  insertedAt: String!
  updatedAt: String!
}

type User {
  id: ID!
  email: String!
  name: String!
  username: String!
  insertedAt: String!
  updatedAt: String!
}

 type Query {
   threads: [Thread!]!
   categories: [Category!]!
   posts: [Post!]!
   users: [User!]!
 }
`;

module.exports = typeDefs;