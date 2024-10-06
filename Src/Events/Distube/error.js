const { EmbedBuilder } = require('discord.js')
const Event = require('../../Structures/Event')

module.exports = class DistubeError extends Event {
   constructor(client) {
      super(client, 'error')
   }

   async run(error) {
      console.log(`❌ ✦ [At ${__filename}]`, error)

      this.client.channels.cache
         .get('1284118429262942219')
         .send({ embeds: [new EmbedBuilder().setDescription(error.message)] })
   }
}
