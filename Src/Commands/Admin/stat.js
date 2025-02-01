const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Stat extends Command {
   constructor(client) {
      super(client)
      this.isAdmin = true
      this.data = new SlashCommandBuilder().setName('stat').setDescription('✦ Show bot statistics')
   }

   async run(interaction, embed) {
      embed.setDescription(
         `**✦ Guild: \`${this.client.guilds.cache.size}\`
         ✦ Voice: \`${this.client.voice.adapters.size}\`
         ✦ Up Time: <t:${Math.floor(Number(Date.now() - this.client.uptime) / 1000)}:R>
         ✦ Ping: \`${this.client.ws.ping} MS\`
         ✦ Heap: \`${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB\`
         ✦ Memory: \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\`**`
      )

      this.removeMessage(await interaction.editReply({ embeds: [embed] }), 40000)
   }
}
