const Button = require('../Structures/Button')

module.exports = class PlayerPrev extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerPrev'
   }

   async run(interaction, queue) {
      try {
         await queue.previous().catch(() => {
            queue.playerEmbed.setFooter({
               text: `✦ 🌵 No song`,
               iconURL: interaction.user.avatarURL(),
            })
         })
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
