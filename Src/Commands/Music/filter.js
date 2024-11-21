const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { description, sendErrorEmbed } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Filter extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('filter').setDescription('✦ Modify filters')
   }

   async run(interaction, embed) {
      return this.removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ This command is being maintained ><')] }), 10000)

      const queue = this.player.getQueue(interaction.guild.id)

      try {
         if (!queue || !queue.playing) {
            return this.removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ No music is playing')] }), 10000)
         }

         embed
            .setImage(this.config.embed.image)
            .setDescription(description(queue))
            .setAuthor({ name: this.config.embed.author.filter, iconURL: interaction.guild.iconURL() })
            .setFooter({ text: `🧩 • Requested by ${interaction.user.globalName}`, iconURL: interaction.user.avatarURL() })
            .setTimestamp()

         const buttons = ['3d', 'haas', 'vaporwave', 'nightcore'].map((id) =>
            new ButtonBuilder()
               .setCustomId(id)
               .setLabel(id.charAt(0).toUpperCase() + id.slice(1))
               .setStyle(2)
         )
         buttons.push(new ButtonBuilder().setCustomId('filterClose').setLabel('Close').setStyle(4))

         const row = new ActionRowBuilder().addComponents(buttons)
         const message = await interaction.editReply({ embeds: [embed], components: [row] })
         const filter = (i) => i.user.id === interaction.user.id
         const collector = message.createMessageComponentCollector({ filter, time: 120000 })

         collector.on('collect', async (button) => {
            await button.deferUpdate()
            const { customId } = button

            if (customId === 'filterClose') {
               collector.stop()
            } else if (queue.filters.has(customId)) {
               queue.filters.remove(customId)
            } else {
               queue.filters.add(customId)
            }
            embed.setDescription(description(queue))
            await button.editReply({ embeds: [embed], components: [row] })
         })

         collector.on('end', () => this.removeMessage(message, 100))
      } catch (error) {
         sendErrorEmbed(interaction, embed)
         console.error(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
