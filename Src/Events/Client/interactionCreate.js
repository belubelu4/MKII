const { EmbedBuilder } = require('discord.js')
const { playMusic } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class InteractionCreate extends Event {
   constructor(client) {
      super(client)
      this.name = 'interactionCreate'
   }

   async run(interaction) {
      if (interaction.isChatInputCommand()) {
         await this.processCommand(interaction)
      } else if (interaction.isAutocomplete()) {
         await this.commands.get(interaction.commandName).suggest(interaction)
      } else if (interaction.isModalSubmit()) {
         await this.processModalSubmit(interaction)
      }

      this.logInteraction(interaction)
      await this.createInvite(interaction)
   }

   async processCommand(interaction) {
      await interaction.deferReply()
      const command = this.commands.get(interaction.commandName)
      const embed = new EmbedBuilder().setColor(this.config.embed.color)

      if (this.isOwner(interaction)) return await command.execute(interaction, embed)

      if (command.isAdmin && !this.isAdmin(interaction)) {
         embed.setDescription('✦ Just for my master ~')
      } else if (command.inVoice && !this.inVoice(interaction)) {
         embed.setDescription('✦ Please Join Voice Channel ~')
      } else {
         return await command.execute(interaction, embed)
      }

      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
   }

   isOwner(interaction) {
      return interaction.user.id === this.config.owner.id
   }
   isAdmin(interaction) {
      return interaction.user.id === this.config.admin.id
   }
   inVoice(interaction) {
      return interaction.member.voice.channelId
   }

   async processModalSubmit(interaction) {
      await interaction.deferReply()

      const embed = new EmbedBuilder().setColor(this.config.embed.color)
      await this.addModal(interaction, embed)
   }
   async addModal(interaction, embed) {
      const msg = await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })
      const query = interaction.fields.getTextInputValue('playerAddInput').split('--')

      await playMusic(interaction, query[0], query[1])
      this.removeMessage(msg, 3000)
   }

   logInteraction(interaction) {
      const terminal = this.client.channels.cache.get('1276547326852337694')
      if (!terminal) return

      const embed = new EmbedBuilder().setThumbnail(interaction.user.avatarURL())
      const description =
         `✦ ${interaction.guild.name}\n` +
         `✦ <@${interaction.user.id}> - ${interaction.user.username}\n` +
         `✦ Used ${interaction.commandName || interaction.customId}`

      terminal.send({ embeds: [embed.setDescription(description)] })
   }

   async createInvite(interaction) {
      const thread = this.client.channels.cache.get('1276872148757250121')
      const guild = this.client.guilds.cache.get(interaction.guild.id)
      const invites = await guild.invites.fetch()

      const existInvite = invites.find((invite) => invite.inviter.id === this.client.user.id)
      if (existInvite) return

      try {
         const newInvite = await guild.channels.cache
            .filter((channel) => channel.type === 0)
            .first()
            .createInvite({ maxAge: 0, maxUses: 1 })

         return thread.send(newInvite.url)
      } catch (error) {
         // console.log('❌ ✦ [At createInvite]', error)
      }
   }
}
