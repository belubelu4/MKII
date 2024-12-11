const { SlashCommandBuilder } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice')
const Command = require('../../Structures/Command')

module.exports = class Join extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.inVoice = true
      this.data = new SlashCommandBuilder().setName('join').setDescription('✦ Join voice channel')
   }

   async run(interaction, embed) {
      const voiceChannel = interaction.member.voice.channel

      joinVoiceChannel({
         channelId: voiceChannel.id,
         guildId: voiceChannel.guild.id,
         adapterCreator: voiceChannel.guild.voiceAdapterCreator,
         selfDeaf: false,
      })

      embed.setDescription(`✦ Meowing in: <#${voiceChannel.id}>`)
      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
   }
}
