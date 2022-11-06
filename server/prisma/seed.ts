
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Deo',
            email: 'john.doe@gmail.com',
            avatar: 'https://avatars.githubusercontent.com/u/68884037?v='

        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-02T12:22:23.779Z',
            firstTeamCountryCode: 'DE',
            secoundTeamCountryCode: 'BR',

        }
    })


    await prisma.game.create({
        data: {
            date: '2022-11-02T12:22:23.779Z',
            firstTeamCountryCode: 'BR',
            secoundTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamCountryPoints: 2,
                    secoundTeamCountryPoints: 2,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }


            }
        }
    })


    // const participants = await prisma.participant.create({
    //     data: {
    //         poolId: pool.id,
    //         userId: user.id,
    //     }
    // })
}
main()