import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../lib/prisma' 
import { string, z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { verifyJWT } from '../users/authUser'



export async function createNewExchange(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().post('/exchange', {
    preHandler: verifyJWT,
    schema: {
      body: z.object({
        tickers: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        date: z.string(),
        exchange_type: z.string()
      })
    },
  }, async (request, reply) => {
    const { tickers, name, price, quantity, date, exchange_type  } = request.body

    if (!tickers || !name || !price || !quantity || !date || !exchange_type) {
      return reply.status(400).send('Favor inserir todos os campos.');
    }

    const userId = request.userId;
    if (!userId) {
      return reply.status(401).send('Usuário não autenticado.');
    }

    const ticker = await prisma.exchange.create({
      data: {
        tickers,
        name,
        price,
        quantity,
        date,
        userId,
        exchange_type
      }
    })
    return reply.status(201).send(ticker)
  })
}

