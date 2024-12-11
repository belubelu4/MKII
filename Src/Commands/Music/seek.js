const { SlashCommandBuilder } = require('discord.js')
const { getSeconds, formatTime, sendErrorEmbed } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Seek extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('seek')
         .setDescription('✦ Change the current time')
         .addStringOption((option) => option.setName('time').setDescription('✦ Example: 5s / 1m 3s / 2h 30m 5s /').setRequired(true))
         .addStringOption((option) =>
            option
               .setName('type')
               .setDescription('✦ Increase or decrease the current time')
               .setRequired(false)
               .addChoices({ name: '✦ Increase', value: 'add' }, { name: '✦ Decrease', value: 'minus' })
         )
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)
      const type = interaction.options.getString('type')
      let position = getSeconds(interaction.options.getString('time'))

      try {
         await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })

         if (!queue || !queue.playing) {
            embed.setDescription('✦ No music playing')
         } else if (isNaN(position)) {
            embed.setDescription('✦ Usage: 2h 3m 4s')
         } else {
            if (type === 'add') {
               position = Math.min(queue.currentTime + position, queue.songs[0].duration)
            } else if (type === 'minus') {
               position = Math.max(queue.currentTime - position, 0)
            }

            queue.seek(position)
            embed.setDescription(`✦ Seeked to ${formatTime(position, false)}`)
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 5000)
      } catch (error) {
         sendErrorEmbed(interaction, embed)
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
