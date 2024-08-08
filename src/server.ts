import fastify from "fastify";
import fastifyCookie from "fastify-cookie";

import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import { createNewExchange } from "./routes/exchanges/create-exchange";
import { listExchange } from './routes/exchanges/list-exchange'
import { deleteExchange } from './routes/exchanges/delete-exchange'
import { createUser } from "./routes/users/create-user";
import { authUser, verifyJWT } from "./routes/users/authUser";

const server = fastify()


server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);


server.register(createNewExchange)
server.register(listExchange)
server.register(deleteExchange)

server.register(createUser)
server.register(authUser)

server.listen({port:3333}).then(() => {
  console.log('Server Running')
})