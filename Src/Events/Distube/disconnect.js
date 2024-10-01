const Event = require('../../Structures/Event')

module.exports = class Disconnect extends Event {
   constructor(client) {
      super(client)
      this.name = 'disconnect'
   }

   async run(queue) {
      if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
      if (queue) await queue.stop()
   }
}
