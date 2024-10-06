const { EmbedBuilder } = require('discord.js')
const Event = require('../../Structures/Event')

module.exports = class ClientError extends Event {
   constructor(client) {
      super(client, 'error')
   }

   async run(error) {
      console.log(`❌ ✦ [At ${__filename}]`, error)

      this.client.channels.cache
         .get('1276547326852337694')
         .send({ embeds: [new EmbedBuilder().setTimestamp().setDescription(error.message)] })
   }
}
