const Event = require('../../Structures/Event')

module.exports = class FinishSong extends Event {
   constructor(client) {
      super(client)
      this.name = 'finishSong'
   }

   async run(queue) {
      if (queue.listener) await queue.listener.stop()
      if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
   }
}
