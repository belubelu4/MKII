const { SlashCommandBuilder } = require('discord.js')
const Command = require('../../Structures/Command')

module.exports = class Help extends Command {
   constructor(client) {
      super(client)
      this.data = new SlashCommandBuilder().setName('help').setDescription('✦ Get info of commands and buttons')
   }

   async run(interaction, embed) {
      try {
         embed
            .setAuthor({ name: this.config.embed.author.help, iconURL: interaction.guild.iconURL() })
            .setDescription('✦ Here are the commands and buttons info to control the music player :3')
            .addFields(
               { name: '───── ✦ C O M M A N D S', value: ' ', inline: false },
               { name: '✦ /play', value: 'Play a song from YouTube, Spotify, or SoundCloud', inline: false },
               { name: '✦ /skip', value: 'Skip the current song or a number of songs', inline: false },
               { name: '✦ /stop', value: 'Stop the music and clear the queue', inline: false },
               { name: '✦ /remove', value: 'Remove the current song or a song at a specific position. Click `List` for more info', inline: false },
               { name: '✦ /filter', value: 'Modify the player’s filters', inline: false },
               { name: '✦ /volume', value: 'Adjust the player’s volume', inline: false },
               { name: '───── ✦ B U T T O N S', value: ' ', inline: false },
               { name: '✦ Mix', value: 'Shuffle the queue', inline: true },
               { name: '✦ Back', value: 'Play the previous song', inline: true },
               { name: '✦ Skip', value: 'Play the next song', inline: true },
               { name: '✦ Loop', value: 'Change loop modes', inline: true },
               { name: '✦ List', value: 'Show the playlist', inline: true },
               { name: '✦ Halt', value: 'Pause/Resume the player', inline: true },
               { name: '✦ Add', value: 'Add the song to the queue', inline: true },
               { name: '✦ Grab', value: 'Get current song info', inline: true },
               { name: '✦ Clear', value: 'Clear the queue', inline: true }
            )
         this.removeMessage(await interaction.editReply({ embeds: [embed] }), 120000)
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}
