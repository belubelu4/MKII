const { SlashCommandBuilder } = require('discord.js')
const { playMusic } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Test extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('test')
         .setDescription('✦ Play music from various sources')
   }

   async run(interaction, embed) {
      const name = 'ID22424'
      const position = 0
      const message = await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })

      try {
         await playMusic(interaction, name, position)
         this.removeMessage(message, 3000)
      } catch (error) {
         await interaction.editReply({ embeds: [embed.setDescription('✦ Not found')] })
         this.removeMessage(message, 5000)
         console.log(`❌  ✦ [At ${__filename}]`, error)
      }
   }
}
