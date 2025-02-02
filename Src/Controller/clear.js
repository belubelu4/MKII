const Button = require('../Structures/Button')

module.exports = class PlayerClear extends Button {
   constructor(client) {
      super(client, 'playerClear')
   }

   async run(interaction, queue) {
      if (queue.songs.length > 1) queue.songs.splice(1, queue.songs.length - 1)

      queue.playerEmbed.setFooter({
         text: `✦ 🥖 Queue cleared by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })
   }
}