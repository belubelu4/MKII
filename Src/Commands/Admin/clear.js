const { SlashCommandBuilder } = require('discord.js')
const { deleteMessage, strict, isOwner, isAdmin } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Clear extends Command {
   constructor(client) {
      super(client)
      this.data = new SlashCommandBuilder().setName('clear').setDescription('✦ Clear player messages in all guilds')
   }

   async run(interaction, embed) {
      if (!isOwner(interaction) && !isAdmin(interaction)) return strict(interaction)

      try {
         const guilds = this.client.guilds.cache

         for (const guild of guilds.values()) {
            await this.clearPlayerMessages(guild)
         }

         deleteMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ Messages cleared')] }), 5000)
      } catch (error) {
         console.error(`❌ Error in command [At ${__filename}]:`, error)
         await interaction.editReply({ content: '❌ An error occurred while clearing messages.', embeds: [embed] })
      }
   }

   async clearPlayerMessages(guild) {
      const textChannels = guild.channels.cache.filter((channel) => channel.type === 0)
      if (textChannels.size === 0) return

      for (const channel of textChannels.values()) {
         await this.clear(channel)
      }
   }

   async clear(channel) {
      try {
         const messages = await channel.messages.fetch({ limit: 100 })
         if (messages.size === 0) return

         const messagesToDelete = messages.filter((message) => this.shouldDelete(message))
         await Promise.all(messagesToDelete.map((message) => message.delete()))
      } catch (error) {}
   }

   shouldDelete(message) {
      const { author, embeds } = message
      return (
         (author.tag === 'DISBOARD#2760' && message.guild.id === this.config.guild.id) ||
         (author.tag === 'Raiden Shogun#9673' && embeds.length > 0 && embeds[0].author?.name.includes('🪐'))
      )
   }
}