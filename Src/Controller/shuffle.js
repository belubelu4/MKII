const Button = require('../Structures/Button')

module.exports = class PlayerShuffle extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerShuf'
   }

   async run(interaction, queue) {
      try {
         await queue.shuffle()
         queue.playerEmbed.setFooter({
            text: `✦ 🌱 Shuffled by ${interaction.user.globalName}`,
            iconURL: interaction.user.avatarURL(),
         })
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
