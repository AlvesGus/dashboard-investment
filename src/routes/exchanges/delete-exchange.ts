import { FastifyInstance } from "fastify";
import { prisma } from '../../lib/prisma'
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../users/authUser";


export async function deleteExchange(server: FastifyInstance){
  server.withTypeProvider<ZodTypeProvider>().delete('/exchange/delete/:id',{
    preHandler: verifyJWT,
    schema: {
      params: z.object({
        id: z.string()
      })
    },
}, async (request, reply) => {
    const { id } = request.params
    const userId = request.userId

    if (!userId) {
      return reply.status(401).send('Usuário não autenticado.');
    }


    

    const exchangeExists = await prisma.exchange.findUnique({
      where: {
        id,
        userId: userId
      }
    })

    
    if(!exchangeExists) {
      return reply.status(404).send('Ação não encontrada. Tente novamente.')
    }

    const deleteExchange = await prisma.exchange.delete({
      where: {
        id
      }
    })  



    return reply.status(200).send({message: 'Ação excluída com sucesso'})
  })
}