const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Leave extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('leave').setDescription('✦ Make me leave voice channel')
   }

   async run(interaction, embed) {
      const queue = this.player.getQueue(interaction.guildId)

      try {
         if (queue) {
            this.player.voices.leave(interaction.guildId)
            embed.setDescription('✦ Have a nice day :3')
         } else {
            embed.setDescription('✦ Just leave me there')
         }

         const reply = await interaction.editReply({ embeds: [embed] })
         this.removeMessage(reply, 10000)
      } catch (error) {
         console.error(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
