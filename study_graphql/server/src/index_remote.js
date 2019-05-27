const { HttpLink } = require('apollo-link-http');

const fetch = require('node-fetch');

const link = new HttpLink({ uri: 'http://api.githunt.com/graphql', fetch });

const { introspectSchema, makeRemoteExecutableSchema, ApolloServer } = require('apollo-server');

const schema = introspectSchema(link);

const executableSchema = makeRemoteExecutableSchema({
  schema,
  link,
});

const server = new ApolloServer({ schema: executableSchema });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});