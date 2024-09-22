const { emitError } = require('../Functions')
const Chat = require('../Structures/Chat')

module.exports = class Tea extends Chat {
   constructor(client) {
      super(client)
      this.data = {
         name: 'dâng trà',
      }
   }

   async run(message, args) {
      try {
         await message.channel.send(`Mời chủ nhân dùng trà 🍵`)

         await message.channel.send(
            'https://cdn.discordapp.com/attachments/1236634193019277322/1272792232855867402/Tea_Anime_GIF_-_Tea_Anime_Tea_Time_-_Discover__Share_GIFs.gif?ex=66bc43a3&is=66baf223&hm=b234d63bcc4be00d4ff0251f36dbb8b2d1e42de39a0d0d05f00fbe5797df0903&'
         )
      } catch (error) {
         emitError(__filename, error)
      }
   }
}
