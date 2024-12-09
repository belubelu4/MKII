const { SlashCommandBuilder } = require('discord.js')
const { sendErrorEmbed } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Stop extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('stop').setDescription('✦ Stop the music and clear the queue')
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)

      try {
         if (!queue || !queue.playing) {
            embed.setDescription('✦ No music is currently playing')
         } else {
            if (queue.playerMessage) await queue.playerMessage.delete().catch(() => {})
            await queue.stop()
            embed.setDescription('✦ Stopped the music and cleared the queue')
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 5000)
      } catch (error) {
         sendErrorEmbed(interaction, embed)
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
