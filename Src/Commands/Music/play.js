const { SlashCommandBuilder } = require('discord.js')
const { playMusic } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Play extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('play')
         .setDescription('✦ Play music from various sources')
         .addStringOption((option) => option.setName('name').setDescription('✦ Type song name or link :3').setRequired(true))
         .addIntegerOption((option) => option.setName('position').setDescription('✦ Position to be added').setRequired(false))
   }

   async run(interaction, embed) {
      const name = interaction.options.getString('name')
      const position = interaction.options.getInteger('position')
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
