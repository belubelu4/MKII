const Button = require('../Structures/Button')

module.exports = class PlayerPause extends Button {
   constructor(client) {
      super(client, 'playerPause')
   }

   async run(interaction, queue) {
      if (queue.paused) {
         queue.resume()
         queue.actionRows[1].components[2].setStyle(2).setEmoji(this.config.buttons.pause)
      } else {
         queue.pause()
         queue.actionRows[1].components[2].setStyle(4).setEmoji(this.config.buttons.resume)
      }

      this.updateButtons(queue)
      queue.playerEmbed.setFooter({
         text: `${queue.paused ? '✦ 💤 Paused' : '✦ 🍕 Resumed'} by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })
   }

   async updateButtons(queue) {
      try {
         if (queue.playerMessage) await queue.playerMessage.edit({ components: queue.actionRows })
      } catch (error) {
         //console.log('❌   ✦ 🍕 UpdateButtons Error\n', error)
      }
   }
}
