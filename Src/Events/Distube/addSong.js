const { getAddSongEmbed } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class AddSong extends Event {
   constructor(client) {
      super(client)
      this.name = 'addSong'
   }

   async run(queue, song) {
      try {
         queue.textChannel.send({ embeds: [getAddSongEmbed(this.client, song)] }).catch(() => {})
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}