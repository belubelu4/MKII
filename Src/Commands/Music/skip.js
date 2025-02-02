const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Skip extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('skip')
         .setDescription('✦ Skip current song')
         .addNumberOption((option) => option.setName('number').setDescription('✦ Amount to skip').setRequired(false))
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)
      const number = interaction.options.getNumber('number')

      try {
         if (!queue || !queue.playing) {
            embed.setDescription('✦ No music is currently playing')
         } else if (number) {
            if (number > queue.songs.length) {
               embed.setDescription('✦ Exceeded current number of songs')
            } else if (isNaN(number) || number < 1) {
               embed.setDescription('✦ Invalid Number')
            } else {
               try {
                  await this.player.jump(interaction, number)
                  embed.setDescription(`✦ Skipped ${number} songs`)
               } catch {
                  embed.setDescription('✦ No songs to skip')
               }
            }
         } else {
            try {
               embed.setDescription(`✦ Skipped [${queue.songs[0].name}](${queue.songs[0].url})`)
               await queue.skip()
            } catch {
               embed.setDescription('✦ No song to skip')
            }
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
