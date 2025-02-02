const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Disconnect extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder().setName('disconnect').setDescription('✦ Disconnects from all voice channels')
   }

   async run(interaction, embed) {
      const message = await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })

      this.player.queues.collection.forEach((_, guildId) => {
         this.player.voices.leave(guildId)
      })

      this.removeMessage(message, 5000)
   }
}
