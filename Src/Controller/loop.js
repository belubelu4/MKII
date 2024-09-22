const { triModeLoop } = require('../Functions')
const Button = require('../Structures/Button')

module.exports = class PlayerLoop extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerLoop'
   }

   async run(interaction, queue) {
      try {
         await triModeLoop(queue)
         const loopMode = ['✦ 🍟 Loop off', '✦ 🫓 Loop song', '✦ 🫓 Loop queue']
         queue.playerEmbed.setFooter({
            text: `${loopMode[queue.repeatMode]} by ${interaction.user.globalName}`,
            iconURL: interaction.user.avatarURL(),
         })
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
