const { getAddSongEmbed } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class AddSong extends Event {
   constructor(client) {
      super(client, 'addSong')
   }

   async run(queue, song) {
      queue.textChannel.send({ embeds: [getAddSongEmbed(this.client, song)] }).catch(() => {})
   }
}
