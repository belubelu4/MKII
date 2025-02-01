const Button = require('../Structures/Button')

module.exports = class PlayerShuffle extends Button {
   constructor(client) {
      super(client, 'playerShuf')
   }

   async run(interaction, queue) {
      for (let i = 0; i<3; i++) queue.shuffle()

      queue.playerEmbed.setFooter({
         text: `✦ 🌱 Shuffled by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })
   }
}
