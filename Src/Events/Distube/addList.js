const { getAddListEmbed } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class AddList extends Event {
   constructor(client) {
      super(client, 'addList')
   }

   async run(queue, list) {
      const maxSongs = this.config.listLimit

      if (list.songs.length > maxSongs) {
         queue.songs = list.songs.slice(0, maxSongs)
         list.songs = list.songs.slice(0, maxSongs)
      }

      queue.textChannel.send({ embeds: [getAddListEmbed(this.client, list)] }).catch(() => {})
   }
}
