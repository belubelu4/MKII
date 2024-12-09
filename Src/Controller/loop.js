const Button = require('../Structures/Button')

module.exports = class PlayerLoop extends Button {
   constructor(client) {
      super(client, 'playerLoop')
   }

   async run(interaction, queue) {
      await this.triModeLoop(queue)
      const loopMode = ['✦ 🍟 Loop off', '✦ 🫓 Loop song', '✦ 🫓 Loop queue']
      queue.playerEmbed.setFooter({
         text: `${loopMode[queue.repeatMode]} by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })
   }

   async biModeLoop(queue) {
      await queue.setRepeatMode(queue.repeatMode === 2 ? 1 : 2)
   }
   async triModeLoop(queue) {
      await queue.setRepeatMode(queue.repeatMode === 2 ? 0 : queue.repeatMode + 1)
   }
}
