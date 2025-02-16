const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Settings extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder()
         .setName('settings')
         .setDescription('✦ Edit settings of the bot')
         .addSubcommand((subcommand) =>
            subcommand
               .setName('edit')
               .setDescription('✦ Change various settings')
               .addStringOption ((option) => option.setName('admin-id').setDescription('✦ Set the admin ID').setRequired(false))
               .addStringOption ((option) => option.setName('api').setDescription('✦ Set the API endpoint').setRequired(false))
               .addIntegerOption((option) => option.setName('list-limit').setDescription('✦ Set list limit').setRequired(false))
               .addStringOption ((option) => option.setName('embed-color').setDescription('✦ Set the embed color').setRequired(false))
               .addStringOption ((option) => option.setName('embed-thumbnail').setDescription('✦ Set the embed thumbnail URL').setRequired(false))
               .addStringOption ((option) => option.setName('embed-image').setDescription('✦ Set the embed image URL').setRequired(false))
               .addBooleanOption((option) => option.setName('maintain-mode').setDescription('✦ Set the maintain status').setRequired(false))
               .addBooleanOption((option) => option.setName('strict-mode').setDescription('✦ Set the strict status').setRequired(false))
               .addBooleanOption((option) => option.setName('invite-status').setDescription('✦ Set the invite status').setRequired(false))
               .addBooleanOption((option) => option.setName('auto-join').setDescription('✦ Set auto join status').setRequired(false))
               .addStringOption ((option) => option.setName('author-small').setDescription('✦ Set author').setRequired(false))
               .addStringOption ((option) => option.setName('author-large').setDescription('✦ Set author').setRequired(false))
               .addStringOption ((option) => option.setName('icons-youtube').setDescription('✦ Set the YouTube icon URL').setRequired(false))
               .addStringOption ((option) => option.setName('icons-spotify').setDescription('✦ Set the Spotify icon URL').setRequired(false))
               .addStringOption ((option) => option.setName('icons-sc').setDescription('✦ Set the SoundCloud icon URL').setRequired(false))
         )
         .addSubcommand((subcommand) => subcommand.setName('view').setDescription('✦ View settings'))
   }

   async run(interaction, embed) {
      const subcommand = interaction.options.getSubcommand()

      try {
         const settingsOptions = {
            'admin-id':             (value) => (this.config.admin.id = value),
            'api':                  (value) => (this.config.api = value),
            'list-limit':           (value) => (this.config.listLimit = value),
            'embed-color':          (value) => (this.config.embed.color = value),
            'embed-thumbnail':      (value) => (this.config.embed.thumbnail = value),
            'embed-image':          (value) => (this.config.embed.image = value),
            'maintain-mode':        (value) => (this.config.maintain = value),
            'strict-mode':          (value) => (this.config.strict = value),
            'invite-status':        (value) => (this.config.invite.status = value),
            'auto-join':            (value) => (this.config.autoJoin = value),
            'author-small':         (value) => (this.config.embed.author.small = value),
            'author-large':         (value) => (this.config.embed.author.large = value),
            'icons-youtube':        (value) => (this.config.embed.icons.youtube = value),
            'icons-spotify':        (value) => (this.config.embed.icons.spotify = value),
            'icons-sc':             (value) => (this.config.embed.icons.soundcloud = value),
         }

         if (subcommand === 'edit') {
            for (const option of interaction.options.data[0].options) {
               const handler = settingsOptions[option.name]
               if (handler) {
                  handler(option.value, interaction)
               }
            }
            this.removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ Settings updated successfully')] }), 10000)
         } else if (subcommand === 'view') {
            embed.setAuthor({ name: this.config.embed.author.settings, iconURL: interaction.guild.iconURL() }).addFields(
               { name: '✦ Strict Mode', value: this.config.strict ? 'Enabled' : 'Disabled', inline: true },//0
               { name: '✦ Maintain Mode', value: this.config.maintain ? 'Enabled' : 'Disabled', inline: true },//1
               { name: '✦ Auto Join', value: this.config.autoJoin ? 'Enabled' : 'Disabled', inline: true },//2

               { name: '✦ Admin ID', value: this.config.admin.id || 'Not set', inline: true },//3
               { name: '✦ List Limit', value: this.config.listLimit.toString(), inline: true },//4
               { name: '✦ Embed Color', value: this.config.embed.color || 'Not set', inline: true },//5
               { name: '✦ Embed Thumbnail', value: this.config.embed.thumbnail || 'Not set', inline: true },//6
               
               { name: '✦ Icons YouTube', value: this.config.embed.icons.youtube, inline: true },//7
               { name: '✦ Icons Spotify', value: this.config.embed.icons.spotify, inline: true },//8
               { name: '✦ Icons SoundCloud', value: this.config.embed.icons.soundcloud, inline: true },//9

               { name: '✦ Author Small', value: this.config.embed.author.small, inline: false },//10
               { name: '✦ Author Large', value: this.config.embed.author.large, inline: false },//11
            )

            this.removeMessage(await interaction.editReply({ embeds: [embed] }), 120000)
         }
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
