const { ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { isMainGuild } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class InitQueue extends Event {
   constructor(client) {
      super(client, 'initQueue')
   }

   async run(queue) {
      if (isMainGuild(queue.textChannel.guild.id, this.config.guild.id)) {
         queue.voice.setSelfDeaf(false)
         queue.setRepeatMode(2)
         queue.setVolume(99)
      }

      queue.actionRows = [
         new ActionRowBuilder().addComponents(
            new ButtonBuilder({ custom_id: 'playerShuf', style: 2, emoji: this.config.buttons.shuf }),
            new ButtonBuilder({ custom_id: 'playerPrev', style: 2, emoji: this.config.buttons.prev }),
            new ButtonBuilder({ custom_id: 'playerStop', style: 4, emoji: this.config.buttons.stop }),
            new ButtonBuilder({ custom_id: 'playerSkip', style: 2, emoji: this.config.buttons.skip }),
            new ButtonBuilder({ custom_id: 'playerLoop', style: 2, emoji: this.config.buttons.loop })
         ),
         new ActionRowBuilder().addComponents(
            new ButtonBuilder({ custom_id: 'playerQueue', style: 2, emoji: this.config.buttons.queue }),
            new ButtonBuilder({ custom_id: 'playerAdd', style: 2, emoji: this.config.buttons.add }),
            new ButtonBuilder({ custom_id: 'playerPause', style: 2, emoji: this.config.buttons.pause }),
            new ButtonBuilder({ custom_id: 'playerGrab', style: 2, emoji: this.config.buttons.grab }),
            new ButtonBuilder({ custom_id: 'playerClear', style: 2, emoji: this.config.buttons.clear })
         ),
      ]

      this.removeMessage(await queue.textChannel.send({ embeds: [this.client.greeting[0]], components: [this.client.greeting[1]] }), 80000)
   }
}
