const { Routes, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')
const Event = require('../../Structures/Event')

module.exports = class Ready extends Event {
   constructor(client) {
      super(client, 'ready')
   }

   async run() {
      console.log('✔️    ✦ 🪐 From Booba Saga With Luv')
      console.log('✔️    ✦ 🧩 Logged in as -- ' + this.client.user.username)

      this.client.isEi = this.client.user.username === 'Raiden Shogun'
      this.setPresence(this.client)
      this.initGreeting(this.client)

      const entry = await this.client.rest.get(Routes.applicationCommands(this.client.user.id))
      const { guild, global } = this.config.test
         ? { guild: this.client.interface.flat(), global: [] }
         : { guild: this.client.interface[0], global: this.client.interface[1] }

      await this.client.rest.put(Routes.applicationGuildCommands(this.client.user.id, this.client.config.guild.id), { body: guild })
      await this.client.rest.put(Routes.applicationCommands(this.client.user.id), { body: [entry[0], ...global] })

      
   }

   setPresence(client) {
      const states = [
         '✦ おまえはもう死んでる',
         '✦ From Ryo.o With ❤️‍🔥',
         '✦ Musou Isshin ⚡',
         '✦ Booba Saga 🌻',
         '✦ Hypnotized 🫧',
         '✦ Eternity 🪐',
      ]

      setInterval(() => {
         client.user.setPresence({
            status: Math.random() < 0.4 ? 'online' : 'idle',
            activities: [
               { type: 4, name: states[Math.floor(Math.random() * states.length)] },
               { type: 4, name: `✦ Watching ${client.guilds.cache.size} Servers 🥯` },
            ],
         })
      }, 24000)
   }

   initGreeting(client) {
      client.greeting = [
         new EmbedBuilder()
            .setColor(client.config.embed.color)
            .setThumbnail(client.config.embed.thumbnail)
            .setDescription(
               '✦ Wish you a happy music time, moah moah\n' +
                  '✦ Click buttons below for more info\n' +
                  '✦ From Pooba Saga with luv\n' +
                  '✦ ' + client.user.username + ' :3'
            ),

         new ActionRowBuilder().addComponents(
            new ButtonBuilder({ label: 'Vote For Me', style: 5 }).setURL(client.config.invite.vote).setDisabled(!client.isEi),
            new ButtonBuilder({ label: 'Invite Me', style: 5 }).setURL(client.config.invite.url).setDisabled(!client.isEi),
            new ButtonBuilder({ label: 'Join Server', style: 5 }).setURL(client.config.invite.guild)
         ),
      ]
   }
}