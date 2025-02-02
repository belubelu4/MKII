const { autoJoin, updateDescription, unDeaf, isMainGuild } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class VoiceStateUpdate extends Event {
   constructor(client) {
      super(client, 'voiceStateUpdate')
   }

   async run(oldState, newState) {
      updateDescription(this.client, oldState, newState)

      if (this.config.autoJoin) autoJoin(this.client, oldState, newState)

      // if (isMainGuild(newState.guild.id, this.config.guild.id)) {
      //    unDeaf(this.player.getQueue(newState.guild.id))
      // } else {
      //    const voiceChanel = oldState.guild.members.me.voice.channel
      //    if (voiceChanel?.id === oldState.channelId && !voiceChanel.members.some((member) => !member.user.bot)) {
      //       setTimeout(() => this.player.voices.leave(oldState.guild.id), 5000)
      //    }
      // }
   }
}
