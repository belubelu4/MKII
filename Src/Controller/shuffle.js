const Button = require('../Structures/Button')

module.exports = class PlayerShuffle extends Button {
   constructor(client) {
      super(client, 'playerShuf')
   }

   async run(interaction, queue) {
      await queue.shuffle()
      queue.playerEmbed.setFooter({
         text: `✦ 🌱 Shuffled by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })
   }
}
