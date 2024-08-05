import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../lib/prisma' 
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function createUser(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().post('/user/create', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string()
      })
    }
  }, async (req, reply) => {
    const { email, password, name } = req.body

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if(existingUser) {
      return reply.status(400).send('Usuário já cadastrado.')
    }
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt);



    try {
      const user = await prisma.user.create({
        data:{
          name,
          email,
          password: passwordHash,
        }
      })

      return reply.status(201).send()
    } catch (error) {
      return reply.status(500).send('Erro ao criar usuário')
    }
  })
}
