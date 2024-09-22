const Event = require('../../Structures/Event')

module.exports = class Disconnect extends Event {
   constructor(client) {
      super(client)
      this.name = 'disconnect'
   }

   async run(queue) {
      try {
         if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
         if (queue) await queue.stop()
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}