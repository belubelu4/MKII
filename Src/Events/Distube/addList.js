const { getAddListEmbed } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class AddList extends Event {
   constructor(client) {
      super(client, 'addList')
   }

   async run(queue, list) {
      queue.textChannel.send({ embeds: [getAddListEmbed(this.client, list)] }).catch(() => {})
   }
}
