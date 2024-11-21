const Event = require('../../Structures/Event')

module.exports = class MessageCreate extends Event {
   constructor(client) {
      super(client, 'messageCreate')
   }

   async run(message) {
      return

      const chat = this.chats.get(message.content)
      if (!chat) return
      await chat.execute()
   }
}
