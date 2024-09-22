const { emitError } = require('../Functions')
const Chat = require('../Structures/Chat')

module.exports = class Cook extends Chat {
   constructor(client) {
      super(client)
      this.data = {
         name: 'nấu ramen',
      }
   }

   async run(message, args) {
      try {
         const dish = args.join(' ')

         await message.reply(`Ramen của chủ nhân đây ạ`)

         message.channel.send(
            'https://cdn.discordapp.com/attachments/1236634193019277322/1272792550436241460/501x392.png?ex=66bc43ef&is=66baf26f&hm=81c9db6ebe22b5cc7292b623d39b0229cd9349bdd77e3a65756bfefd109b0964&'
         )
      } catch (error) {
         emitError(__filename, error)
      }
   }
}
