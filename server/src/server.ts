import Fastify from "fastify";
import cors from '@fastify/cors'
import jwt from "@fastify/jwt";

import { poolsRoute } from "./routes/pool";
import { authRoute } from "./routes/auth";
import { gamesRoute } from "./routes/game";
import { guessesRoute } from "./routes/guess";
import { usersRoute } from "./routes/user";



async function bootstrap() {
    const fastify = Fastify({
        logger: true,

    })
try{
    await fastify.register(cors, {
        origin: true,
    })


//em produção em variavel ambiente

    await fastify.register(jwt,{
        secret: 'nlwcopa',
        
    })

    await fastify.register(authRoute)

    await fastify.register(gamesRoute)

    await fastify.register(guessesRoute)

    await fastify.register(poolsRoute)

    await fastify.register(usersRoute)




    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}catch(err){
fastify.log.error(err)

process.exit(1)
}

}


bootstrap()