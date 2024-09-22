const { EmbedBuilder } = require('discord.js')
const { emitError } = require('../Functions')
const Chat = require('../Structures/Chat')

module.exports = class Help extends Chat {
   constructor(client) {
      super(client)
      this.data = {
         name: 'help',
      }
   }

   async run(message, args) {
      try {
         const helpEmbed = new EmbedBuilder()
            .setColor(this.config.embed.color)
            .setTitle('✦ Help & Data Usage Policy')
            .setDescription('Here are the rules and information regarding data usage:')
            .addFields(
               {
                  name: '1. Respect Others',
                  value: 'Please be respectful to other members in the server. Harassment, hate speech, and discrimination are not tolerated.',
               },
               { name: '2. No Spam', value: 'Avoid spamming messages, links, or images. Repeated offenses may lead to a ban.' },
               {
                  name: '3. Data Usage',
                  value: 'Your interactions with this bot, including commands and messages, are logged for improving the service. Your data is never shared with third parties.',
               },
               {
                  name: '4. Privacy',
                  value: 'We take your privacy seriously. Personal information is not stored or tracked beyond what is necessary for the bot to function.',
               },
               { name: '5. Need Help?', value: 'If you have any issues or questions, feel free to reach out to the server moderators.' }
            )
            .setFooter({ text: 'Have a nice day :3' })

         await message.channel.send({ embeds: [helpEmbed] })
      } catch (error) {
         emitError(__filename, error)
      }
   }
}
