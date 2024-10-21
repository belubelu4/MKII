const Event = require('../../Structures/Event')

module.exports = class FinishSong extends Event {
   constructor(client) {
      super(client, 'finishSong')
   }

   async run(queue) {
      if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
   }
}
