const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Volume extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('volume')
         .setDescription('✦ Adjust the volume of the music')
         .addIntegerOption((option) => option.setName('volume').setDescription('✦ Type a number').setRequired(true))
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)
      const vol = interaction.options.getInteger('volume')
      const maxVol = 100

      try {
         if (!queue || !queue.playing) {
            embed.setDescription('✦ No music is currently playing')
         } else if (queue.volume === vol) {
            embed.setDescription(`✦ Volume is already set to ${vol}`)
         } else if (!vol || vol < 1 || vol > maxVol) {
            embed.setDescription(`✦ Type a number between 1 and ${maxVol}`)
         } else {
            await queue.setVolume(vol)
            embed.setDescription(`✦ Set volume to ${vol}`)
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
