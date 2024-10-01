const Event = require('../../Structures/Event')

module.exports = class MessageCreate extends Event {
   constructor(client) {
      super(client)
      this.name = 'messageCreate'
   }

   async run(message) {
      const chat = this.chats.get(message.content)
      if (!chat) return
      await chat.execute()
   }
}