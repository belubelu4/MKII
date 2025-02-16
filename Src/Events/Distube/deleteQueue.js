const Event = require('../../Structures/Event')

module.exports = class DeleteQueue extends Event {
   constructor(client) {
      super(client, 'deleteQueue')
   }

   async run(queue) {
      console.log(queue)
      if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
   }
}
