const { autoJoin, updateDescription, unDeaf } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class VoiceStateUpdate extends Event {
   constructor(client) {
      super(client)
      this.name = 'voiceStateUpdate'
   }

   async run(oldState, newState) {
      try {
         if (this.config.autoJoin) autoJoin(this.client, oldState, newState)

         updateDescription(this.client, oldState, newState)
         unDeaf(this.player.getQueue(newState.guild.id))
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}