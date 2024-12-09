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

      const options = {
         youtube: {
            thumbnail,
            image: song.thumbnail,
            author: (await isFit(song.thumbnail)) ? author.youtubel : author.youtubes,
            // author: author.youtubel,
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
         .setDescription(`✦ **[${name}](${url.split('&list=')[0]})**\n✦ **<#${voiceChannel.id}>・${formatTime(duration, isLive)}**`)
         .setFooter({ text: `✦ 🧩 Requested by ${user.globalName}`, iconURL: user.avatarURL() })

      queue.playerMessage = await textChannel.send({ embeds: [queue.playerEmbed], components: actionRows })
   }
}
