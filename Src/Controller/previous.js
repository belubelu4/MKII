const Button = require('../Structures/Button')

module.exports = class PlayerPrev extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerPrev'
   }

   async run(interaction, queue) {
      await queue.previous().catch(() => {
         queue.playerEmbed.setFooter({
            text: `✦ 🌵 No song`,
            iconURL: interaction.user.avatarURL(),
         })
      })
   }
}
