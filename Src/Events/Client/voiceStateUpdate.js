const { autoJoin, updateDescription, unDeaf, isMainGuild } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class VoiceStateUpdate extends Event {
   constructor(client) {
      super(client, 'voiceStateUpdate')
   }

   async run(oldState, newState) {
      try {
         if (this.config.autoJoin) autoJoin(this.client, oldState, newState)

         updateDescription(this.client, oldState, newState)
         if(isMainGuild(newState.guild.id, this.config.guild.id)) unDeaf(this.player.getQueue(newState.guild.id))
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
