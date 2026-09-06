
import app from './app';
import config from './config';
import { transporter } from './lib/nodemiler';
import { prisma } from './lib/pirsma';
import { redisClient } from './lib/redis';




const port=config.port
async function main() {
      try {
         await prisma.$connect()
         console.log('database is connect postgress')
         console.log(config.redis_password,'passwornd',config.redis_user)
         await redisClient.connect()
         console.log('redis is connected successfully')
         await transporter.verify()
         console.log('nodemiller is connected successfully') 

       app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`);
       })
      } catch (error) {
       console.log("Error starting the server", error);
      await prisma.$disconnect();
    
       process.exit(1);
      }
}

main()