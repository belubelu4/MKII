const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Stat extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder()
         .setName('stat')
         .setDescription('✦ Show bot statistics')
   }

   async run(interaction, embed) {
      embed
         .setTitle(this.client.user.username)
         .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
         .setDescription(
            `**
            ✦ Command Count: \`${this.client.commands.map((c) => c.name).length}\`
            ✦ Operation Time: <t:${Math.floor(Number(Date.now() - this.client.uptime) / 1000)}:R>
            ✦ Ping: \`${this.client.ws.ping} MS\`
            ✦ Memory Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`
            **`
         )

      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 120000)
   }
}
