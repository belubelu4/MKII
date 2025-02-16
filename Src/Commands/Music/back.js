const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Back extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('back').setDescription('✦ Back to previous song')
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guild.id)

      try {
         try {
            embed.setDescription(`✦ Backed before [${queue.songs[0].name}](${queue.songs[0].url})`)
            await queue.previous()
         } catch {
            embed.setDescription('✦ No song to back')
         }

         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
