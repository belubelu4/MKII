const Button = require('../Structures/Button')

module.exports = class PlayerSkip extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerSkip'
   }

   async run(interaction, queue) {
      try {
         await queue.skip().catch(() => {
            queue.playerEmbed.setFooter({
               text: `✦ 🥙 No song`,
               iconURL: interaction.user.avatarURL(),
            })
         })
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
