import { createYoga } from "graphql-yoga"
import { createServer } from "http"
import { schema } from "./schema"

const yoga = createYoga({
  graphqlEndpoint: "/graphql",
  schema,
  context: (req) => {
    return {
      req,
    }
  },
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log(`🚀 Server ready at: http://localhost:4000/graphql`)
})
