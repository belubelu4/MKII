const Event = require('../../Structures/Event')

module.exports = class MessageCreate extends Event {
   constructor(client) {
      super(client)
      this.name = 'messageCreate'
   }

   async run(message) {
      try {
         if (!message.guild) return

         const args = message.content
         const name = args.toLowerCase()
         const command = this.chats.get(name)

         if (!command) return

         await command.run(message, args)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}