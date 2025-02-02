const { EmbedBuilder } = require('discord.js')
const { playMusic } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class InteractionCreate extends Event {
   constructor(client) {
      super(client, 'interactionCreate')
   }

   async run(interaction) {
      const embed = new EmbedBuilder().setColor(this.config.embed.color)

      if (!this.isOwner(interaction) && this.config.maintain) {
         embed.setDescription('✦ Me enjoying dango for a while, Comeback later bae ~\n✦ Maintaining :3').setThumbnail(this.config.embed.thumbnail)
         return this.removeMessage(await interaction.reply({ embeds: [embed] }), 20000)
      }

      if (!this.isOwner(interaction) && this.isMainGuild(interaction) && this.config.strict) {
         embed.setDescription('✦ Nah, me enjoying dango ~')
         return this.removeMessage(await interaction.reply({ embeds: [embed] }), 10000)
      }

      if (interaction.isAutocomplete()) await this.commands.get(interaction.commandName).suggest(interaction)
      else if (interaction.isChatInputCommand()) await this.processCommand(interaction, embed)
      else if (interaction.isModalSubmit()) await this.processModalSubmit(interaction, embed)
      else if (interaction.isButton()) await this.processButton(interaction)

      this.logInteraction(interaction)
   }

   isMainGuild(interaction) {
      return interaction.guild.id === this.config.guild.id
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

   async processCommand(interaction, embed) {
      await interaction.deferReply()
      const command = this.commands.get(interaction.commandName)

      if (!this.isOwner(interaction) && command.isAdmin && !this.isAdmin(interaction)) embed.setDescription('✦ Just for my master ~')
      else if (command.inVoice && !this.inVoice(interaction)) embed.setDescription('✦ Please join voice channel bae ~')
      else return await command.execute(interaction, embed)

      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
   }

   async processModalSubmit(interaction, embed) {
      await this.addModal(interaction, embed)
   }
   async addModal(interaction, embed) {
      const msg = await interaction.reply({ embeds: [embed.setDescription('✦ Meowing')] })
      const query = interaction.fields.getTextInputValue('playerAddInput').split('--')

      await playMusic(interaction, query[0], query[1])
      this.removeMessage(msg, 3000)
   }

   async processButton(interaction) {
      if (interaction.customId !== 'playerAdd') await interaction.deferUpdate()
      const queue = this.player.getQueue(interaction.guild.id)

      await this.buttons
         .get(interaction.customId)
         .execute(interaction, queue)
         .catch((error) => console.log('❌  ✦ 🥙 Button Error', error))

      if (!['playerStop', 'playerAdd'].includes(interaction.customId)) await this.updateEmbed(queue)
   }
   async updateEmbed(queue) {
      try {
         if (queue.playerMessage) await queue.playerMessage.edit({ embeds: [queue.playerEmbed.setTimestamp()] })
      } catch (error) {}
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
