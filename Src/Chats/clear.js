const { emitError } = require('../Functions')
const Chat = require('../Structures/Chat')

module.exports = class Clear extends Chat {
   constructor(client) {
      super(client)
      this.data = {
         name: 'clear',
      }
   }

   async run(message, args) {
      try {
         if (message.member.user.id !== this.config.owner.id) return

         const numberOfMessages = parseInt(args[0], 10) || 1

         const messages = await message.channel.messages.fetch({ limit: numberOfMessages + 1 })
         const botMessages = messages.filter((msg) => msg.author.bot)

         botMessages.forEach((msg) => {
            msg.delete().catch((error) => emitError(__filename, error))
         })
      } catch (error) {
         emitError(__filename, error)
      }
   }
}
