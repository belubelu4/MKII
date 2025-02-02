const { EmbedBuilder } = require('discord.js')
const { formatTime, isFit } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class PlaySong extends Event {
   constructor(client) {
      super(client, 'playSong')
   }

   async run(queue, song) {
      const { color, thumbnail, imageRoxy, author, icons } = this.config.embed
      const { name, url, duration, isLive, user, source } = song
      const { actionRows, textChannel, voiceChannel } = queue

      const getAuthorInfo = async (source) => {
         switch (source) {
            case 'youtube':
               return {
                  thumbnail,
                  image: song.thumbnail,
                  author: (await isFit(song.thumbnail)) ? author.youtubel : author.youtubes,
               }
            case 'spotify':
            case 'soundcloud':
               return {
                  thumbnail: song.thumbnail,
                  image: Math.random() < 0.5 ? imageRoxy.high : imageRoxy.dance,
                  author: author[source],
               }
         }
      }

      const options = await getAuthorInfo(source)

      queue.playerEmbed = new EmbedBuilder()
         .setColor(color)
         .setTimestamp()
         .setThumbnail(options.thumbnail)
         .setImage(options.image)
         .setAuthor({ name: options.author, iconURL: icons[source] })
         .setDescription(`✦ **[${name}](${url.split('&list=')[0]})**\n✦ **<#${voiceChannel.id}>・${formatTime(duration, isLive)}**`)
         .setFooter({ text: `✦ 🧩 Requested by ${user.globalName}`, iconURL: user.avatarURL() })

      queue.playerMessage = await textChannel.send({ embeds: [queue.playerEmbed], components: actionRows })
   }
}
