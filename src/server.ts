import { createYoga } from "graphql-yoga"
import { createServer } from "http"
import { schema } from "./schema"

const port = process.env.POST || 4000

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

server.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}/graphql`)
})
