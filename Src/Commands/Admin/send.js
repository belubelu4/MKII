const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Send extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder()
         .setName('send')
         .setDescription('✦ Send a message to a channel')
         .addStringOption((option) => option.setName('channel').setDescription('✦ Specify the channel ID').setRequired(true).setAutocomplete(true))
         .addStringOption((option) => option.setName('message').setDescription('✦ Message content').setRequired(true))
   }

   async suggest(interaction) {
      const choices = [
         { name: '🌱・chat', value: '684975114923933781' },
         { name: '🧩・commands', value: '753275189084553276' },
         { name: '🥪・ryo.o', value: '1259958972757049486' },
         { name: '🥪・liltuan', value: '1259547237218779207' },
      ]
      const query = interaction.options.getFocused()
      const filtered = choices.filter((choice) => choice.name.includes(query))
      const response = filtered.map((choice) => ({ name: choice.name, value: choice.value }))
      
      await interaction.respond(response)
   }

   async run(interaction, embed) {
      const channelID = interaction.options.getString('channel')
      const message = interaction.options.getString('message')
      if (!channelID || !message) {
         embed.setDescription(`✦ Channel ID or message is missing`)
         return this.removeMessage(await interaction.editReply({ embeds: [embed] }), 5000)
      }

      const channel = interaction.client.channels.cache.get(channelID)
      if (!channel) {
         embed.setDescription(`✦ There is no channel with the provided ID`)
         return this.removeMessage(await interaction.editReply({ embeds: [embed] }), 5000)
      }

      await channel.send(message)
      embed.setDescription(`✦ Sent message to <#${channel.id}>: ${message}`)
      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 20000)
   }
}