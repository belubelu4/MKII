const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { formatTime, sendErrorEmbed } = require('../../Functions')
const Command = require('../../Structures/Command')

module.exports = class Search extends Command {
   constructor(client) {
      super(client)
      this.inVoice = true
      this.data = new SlashCommandBuilder()
         .setName('search')
         .setDescription('✦ Search music')
         .addStringOption((option) => option.setName('query').setDescription('✦ Type song name').setRequired(true))
         .addIntegerOption((option) =>
            option
               .setName('type')
               .setDescription('Select source type')
               .setRequired(false)
               .addChoices({ name: 'Soundcloud', value: 2 }, { name: 'Youtube', value: 0 })
         )
   }

   async run(interaction, embed) {
      try {
         const query = interaction.options.getString('query')
         const type = interaction.options.getInteger('type') || 0
         const engine = this.player.plugins[type]
         const searchOptions = { type: 'video', limit: 10, safeSearch: false }
         const songs = type === 0 ? await engine.search(query, searchOptions) : await engine.search(query)

         if (!songs || !songs.length) return this.removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ No result')] }), 5000)

         embed
            .setAuthor({ name: this.config.embed.author.search, iconURL: interaction.guild.iconURL() })
            .setDescription(
               songs
                  .map((song, i) => `${i + 1}. [${song.name}](${song.url})・${song.uploader.name}・${formatTime(song.duration, song.isLive)}`)
                  .join('\n')
            )
            .setFooter({ text: `✦ Choose a song` })

         const buttons = songs.map((_, i) =>
            new ButtonBuilder()
               .setCustomId(`search${i + 1}`)
               .setLabel(`${i + 1}`)
               .setStyle(2)
         )

         const rows = []
         for (let i = 0; i < buttons.length; i += 5) rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)))

         rows.push(new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('✦ Close').setStyle(4).setCustomId('searchClose')))

         const message = await interaction.editReply({ embeds: [embed], components: rows })
         const filter = (i) => i.user.id === interaction.user.id
         const listener = message.createMessageComponentCollector({ filter, time: 30000 })

         listener.on('collect', async (button) => {
            if (button.customId === 'searchClose') {
               listener.stop()
               return this.removeMessage(message, 100)
            }
            if (button.customId.startsWith('search')) {
               this.removeMessage(message, 100)
               await this.player.play(interaction.member.voice.channel, songs[Number(button.customId.replace('search', '')) - 1].url, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                  interaction,
               })
               listener.stop()
            }
         })

         listener.on('end', () => this.removeMessage(message, 100))
      } catch (error) {
         sendErrorEmbed(interaction, embed)
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
