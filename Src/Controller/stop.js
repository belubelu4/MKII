const Button = require('../Structures/Button')

module.exports = class PlayerStop extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerStop'
   }

   async run(interaction, queue) {
      try {
         if (queue) await queue.stop()
         if (queue.playerMessage) await queue.playerMessage.delete()
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
