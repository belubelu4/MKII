const { EmbedBuilder } = require('discord.js')
const { formatTime, getAddSongEmbed } = require('../Functions')
const Button = require('../Structures/Button')

module.exports = class PlayerGrab extends Button {
   constructor(client) {
      super(client, 'playerGrab')
   }

   async run(interaction, queue) {
      const song = queue.songs[0]
      const grabEmbed = new EmbedBuilder()
         .setColor(this.config.embed.color)
         .setImage(this.config.embed.image)
         .setAuthor({ name: this.config.embed.author.grab, iconURL: queue.textChannel.guild.iconURL() })
         .setDescription(`✦ Have a nice day <@${interaction.user.id}>\n\`\`\`${song.url.split('&list=')[0]}\`\`\``)
         .setFooter({
            text: `🌱 Time ${formatTime(queue.currentTime, false)} / ${formatTime(song.duration, song.isLive)}`,
            iconURL: interaction.user.avatarURL(),
         })
         .setTimestamp()

      await queue.textChannel.send({ embeds: [grabEmbed] })

      queue.playerEmbed.setFooter({
         text: `✦ 🥝 Song revealed by ${interaction.user.globalName}`,
         iconURL: interaction.user.avatarURL(),
      })

      if (interaction.guild.id === this.client.config.guild.id) {
         const channel = this.client.channels.cache.get('1256209937810456607')
         if (!channel) return
         channel.send(song.url.split('&list=')[0])
         channel.send({ embeds: [grabEmbed.setColor('FF4400')] })

         queue.textChannel.send({ embeds: [getAddSongEmbed(this.client, song)] }).catch(() => {})
      }
   }
}
