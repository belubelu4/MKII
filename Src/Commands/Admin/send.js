const { SlashCommandBuilder } = require('discord.js')
const { deleteMessage, strict, isOwner, isAdmin } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Send extends Command {
   constructor(client) {
      super(client)

      this.data = new SlashCommandBuilder()
         .setName('send')
         .setDescription('✦ Send a message to a channel')
         .addStringOption((option) => option.setName('channel').setDescription('✦ Specify the channel ID').setRequired(true).setAutocomplete(true))
         .addStringOption((option) => option.setName('message').setDescription('✦ Message content').setRequired(true))
   }

   async suggest(interaction) {
      try {
         if (!isOwner(interaction) && !isAdmin(interaction)) {
            return await interaction.respond({ name: `✦ I'm sleeping`, value: ' ' })
         }

         const query = interaction.options.getFocused()
         const choices = [
            { name: '🌱・chat', value: '684975114923933781' },
            { name: '🧩・commands', value: '753275189084553276' },
            { name: '🥪・ryo.o', value: '1259958972757049486' },
            { name: '🥪・liltuan', value: '1259547237218779207' },
         ]

         const filtered = choices.filter((choice) => choice.name.includes(query))
         const response = filtered.map((choice) => ({ name: choice.name, value: choice.value }))

         await interaction.respond(response)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }

   async run(interaction, embed) {
      if (!isOwner(interaction) && !isAdmin(interaction)) return strict(interaction)
      const channelID = interaction.options.getString('channel')
      const messageContent = interaction.options.getString('message')
      const channel = interaction.client.channels.cache.get(channelID)

      try {
         if (!channel) {
            embed.setDescription(`✦ There is no channel with the provided ID`)
            return deleteMessage(await interaction.editReply({ embeds: [embed] }), 5000)
         }

         await channel.send(messageContent)

         embed.setDescription(`✦ Sent message to <#${channel.id}>: ${messageContent}`)
         deleteMessage(await interaction.editReply({ embeds: [embed] }), 20000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
