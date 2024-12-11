const { SlashCommandBuilder } = require('discord.js')
const { playMusic } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Test extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('test').setDescription('✦ Play ID22424')
   }

   async run(interaction, embed) {
      const name = 'ID22424'
      const position = 0
      const message = await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })

      await playMusic(interaction, name, position)
      this.removeMessage(message, 3000)
   }
}
