const { ApolloServer, gql, MockList, AuthenticationError, PubSub } = require('apollo-server');
const casual = require('casual');
const fs = require('fs');
const pubsub = new PubSub();

const POST_ADDED = 'POST_ADDED';

const typeDefs = gql`
  type Query {
    hello: String
    resolved: String
    person: Person
    people: [Person]
    readError: String
    authenticationError: String
  }

  type Person {
    name: String
    age: Int
    friends: [Int]
  }

  type Subscription {
    postAdded: Post
  }

  type Mutation {
    addPost(author: String, comment: String, id: Int): Post
  }

  type Post {
    author: String
    comment: String
    id: Int
  }
`;


const resolvers = {
  Query: {
    resolved: () => 'Resolved',
    readError: (parent, args, context) => {
      fs.readFileSync('/does/not/exist');
    },
    authenticationError: (parent, args, context) => {
      throw new AuthenticationError('must authenticate');
    },
  },
  Mutation: {
    addPost(root, args, context) {
      let newPost = {
        author: args.author,
        comment: args.comment,
        idd: args.id,
      }

      pubsub.publish(POST_ADDED, { newPost });

      return newPost;
    },
  },
  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
};

const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Hello',
  Person: () => ({
    name: casual.name,
    age: () => casual.integer(0, 120),
    friends: () => new MockList([2, 6]),
  }),
  Query: () => ({
    people: () => new MockList([0, 12, 3, 5]),
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,

  mocks,
  mockEntireSchema: false, // Set false để ko overwrite resolvers
  debug: false,
  formatError: (err) => {
    console.log(err);
    if (err.message.startsWith("Database Error: ")) {
      return new Error('Internal server error');
    }
    return err;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
});

server.listen(2000).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
});