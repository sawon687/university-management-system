import crypto from "crypto";
export function passwordGenerator(length:number=12){
       const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "abcdefghijklmnopqrstuvwxyz" +
    "0123456789" +
    "!@#$%^&*";

    let password=''

    for(let i=0; i<length;i++){
          const randomIndex=crypto.randomInt(0,chars.length)
          console.log(' index',randomIndex)
            console.log('chars index',chars[randomIndex])
           password+=chars[randomIndex]
    }

    return password

}

