const { getAddListEmbed } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class AddList extends Event {
   constructor(client) {
      super(client)
      this.name = 'addList'
   }

   async run(queue, list) {
      try {
         queue.textChannel.send({ embeds: [getAddListEmbed(this.client, list)] }).catch(() => {})
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}