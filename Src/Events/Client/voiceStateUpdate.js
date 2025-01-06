const { autoJoin, updateDescription, unDeaf, isMainGuild } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class VoiceStateUpdate extends Event {
   constructor(client) {
      super(client, 'voiceStateUpdate')
      this.leaveTimers = new Map()
   }

   async run(oldState, newState) {
      updateDescription(this.client, oldState, newState)

      if (this.config.autoJoin) autoJoin(this.client, oldState, newState)
      if (isMainGuild(newState.guild.id, this.config.guild.id)) unDeaf(this.player.getQueue(newState.guild.id))

      const botChannel = oldState.guild.members.me.voice.channel
      if (botChannel?.id === oldState.channelId) {
         const hasHumans = botChannel.members.some((member) => !member.user.bot)

         if (hasHumans) {
            this.clearLeaveTimer(botChannel.id)
         } else if (!this.leaveTimers.has(botChannel.id)) {
            this.setLeaveTimer(botChannel.id, () => {
               const stillEmpty = !botChannel.members.some((member) => !member.user.bot)
               if (stillEmpty) this.player.voices.leave(oldState.guild.id)
            })
         }
      }
   }

   setLeaveTimer(channelId, callback) {
      const timer = setTimeout(() => {
         callback()
         this.leaveTimers.delete(channelId)
      }, 30000)

      this.leaveTimers.set(channelId, timer)
   }

   clearLeaveTimer(channelId) {
      const timer = this.leaveTimers.get(channelId)
      if (timer) {
         clearTimeout(timer)
         this.leaveTimers.delete(channelId)
      }
   }
}
