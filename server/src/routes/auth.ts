import { FastifyInstance } from "fastify"
import { z } from "zod"
import { authenticate } from "../plugins/authenticate"
import { prisma } from "../lib/prisma"

export async function authRoute(fastify: FastifyInstance) {

    fastify.get('/me', {
        onRequest: [authenticate]
    }, async (request) => {
        await request.jwtVerify()

        return { user: request.user }
    })



    fastify.post('/user', async (request) => {
        const createUserBody = z.object({
            access_token: z.string(),

        })

        const { access_token } = createUserBody.parse(request.body)

        const userResponse = await fetch('https:www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            }
        })
        const userData = await userResponse.json()

        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        })

        const userInfo = userInfoSchema.parse(userData)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })
        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatar: userInfo.picture,
                }
            })
        }
        //refresh token
        const token = fastify.jwt.sign({
            name: user.name,
            avatar: user.avatar
        }, {
            sub: user.id,
            expiresIn: '7 days',
        })

        return { token }
    })

}