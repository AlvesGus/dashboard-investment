import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/prisma'; 
import { string, z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

export async function authUser(server: FastifyInstance) {
  server.withTypeProvider<ZodTypeProvider>().post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string()
      })
    }
  }, async (req, reply) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send('Usuário não existe.');
    } 

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return reply.status(401).send('Senha incorreta.');
    }

    const userId = user.id
    const token = jwt.sign({userId: user.id}, SECRET, {expiresIn: '7d'})

    return reply.status(200).send({auth: true, token })
  });
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["x-access-token"] as string

  if (!token) {
    return reply.status(401).send('Token não fornecido.');
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string }; 
    request.userId = decoded.userId; 
  } catch (error) {
    return reply.status(401).send('Token inválido. Tente novamente.');
  }
}

