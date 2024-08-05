import { FastifyInstance } from "fastify";
import { prisma } from '../../lib/prisma'
import { verifyJWT } from "../users/authUser";

export async function listExchange(server: FastifyInstance) {
  server.get('/exchanges/all', {
    preHandler: verifyJWT,
  } , async (request, reply) => {
    const  userId  = request.userId

    const exchanges = await prisma.exchange.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      }
    })
    return reply.status(200).send(exchanges)
  })
}