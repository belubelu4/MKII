const { EmbedBuilder } = require('discord.js')
const { formatTime, updateEmbed, auth, reject, isFit } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class PlaySong extends Event {
   constructor(client) {
      super(client)
      this.name = 'playSong'
   }

   async run(queue, song) {
      try {
         const { color, thumbnail, imageRoxy, author, icons } = this.config.embed
         const { name, url, duration, isLive, user, source } = song
         const { actionRows, textChannel, voiceChannel } = queue
         const options = {
            youtube: {
               thumbnail,
               image: song.thumbnail,
               author: (await isFit(song.thumbnail)) ? author.youtubel : author.youtubes,
               icon: icons.youtube,
            },
            spotify: {
               thumbnail: song.thumbnail,
               image: Math.random() < 0.5 ? imageRoxy.high : imageRoxy.dance,
               author: author.spotify,
               icon: icons.spotify,
            },
            soundcloud: {
               thumbnail: song.thumbnail,
               image: Math.random() < 0.5 ? imageRoxy.high : imageRoxy.dance,
               author: author.soundcloud,
               icon: icons.soundcloud,
            },
         }[source]

         queue.playerEmbed = new EmbedBuilder()
            .setColor(color)
            .setTimestamp()
            .setThumbnail(options.thumbnail)
            .setImage(options.image)
            .setAuthor({ name: options.author, iconURL: options.icon })
            .setDescription(`✦ **[${name}](${url})**\n✦ **<#${voiceChannel.id}>・${formatTime(duration, isLive)}**`)
            .setFooter({ text: `✦ 🧩 Requested by ${user.globalName}`, iconURL: user.avatarURL() })

         queue.playerMessage = await textChannel.send({ embeds: [queue.playerEmbed], components: actionRows })
         queue.listener = queue.playerMessage.createMessageComponentCollector()

         queue.listener.on('collect', async (interaction) => {
            if (interaction.customId !== 'playerAdd') await interaction.deferUpdate()
            if (!auth(interaction)) return await reject(interaction, 1)

            await this.buttons
               .get(interaction.customId)
               .run(interaction, queue)
               .catch((error) => console.log('❌  ✦ 🥙 Button Error', error))

            if (!['playerStop', 'playerAdd'].includes(interaction.customId)) await updateEmbed(queue)
         })
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)

         this.client.channels.cache
            .get('1276547326852337694')
            .send({ embeds: [new EmbedBuilder().setTimestamp().setDescription(error)] })
      }
   }
}