const Button = require('../Structures/Button')

module.exports = class PlayerStop extends Button {
   constructor(client) {
      super(client, 'playerStop')
   }

   async run(interaction, queue) {
      if (queue) await queue.stop()
      if (queue.playerMessage) await queue.playerMessage.delete()
   }
}
