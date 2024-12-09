const { SlashCommandBuilder } = require('discord.js')
const { sendErrorEmbed } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Remove extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('remove')
         .setDescription('✦ Remove songs at a specific position')
         .addIntegerOption((option) => option.setName('position').setDescription('✦ Position in the queue').setMinValue(1).setRequired(false))
         .addIntegerOption((option) => option.setName('amount').setDescription('✦ Amount of songs to be removed').setMinValue(1).setRequired(false))
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)
      const position = interaction.options.getInteger('position') || 1
      const amount = interaction.options.getInteger('amount') || 1

      try {
         if (!queue || !queue.playing) {
            embed.setDescription('✦ No music is currently playing')
         } else if (queue.songs.length < position) {
            embed.setDescription('✦ Please provide a valid song position in the queue')
         } else {
            const removedSongs = queue.songs.splice(position - 1, amount)

            if (position === 1) await queue.skip()

            const description =
               amount === 1
                  ? `✦ Removed [${removedSongs[0].name}](${removedSongs[0].url})・Requested by <@${removedSongs[0].user.id}>`
                  : `✦ Removed ${removedSongs.length} songs from the queue`

            embed.setDescription(description)
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 5000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
         sendErrorEmbed(interaction, embed)
      }
   }
}
