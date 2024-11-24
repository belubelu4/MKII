const { isMainGuild } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class InitQueue extends Event {
   constructor(client) {
      super(client, 'initQueue')
   }

   async run(queue) {
      if (isMainGuild(queue.textChannel.guild.id, this.config.guild.id)) {
         queue.voice.setSelfDeaf(false)
         queue.setRepeatMode(2)
         queue.setVolume(99)
      }

      queue.actionRows = this.client.actionRows

      this.removeMessage(await queue.textChannel.send({ embeds: [this.client.greeting[0]], components: [this.client.greeting[1]] }), 80000)
   }
}
