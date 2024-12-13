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
      this.setPresence()
      this.initGreeting()

      const entry = await this.client.rest.get(Routes.applicationCommands(this.client.user.id))
      const launch = entry.find(item => item.name === 'launch')

      let guild = this.client.interface[0]
      let global = this.client.interface[1]
      
      if (launch) global = [...global, launch]

      await this.client.rest.put(Routes.applicationGuildCommands(this.client.user.id, this.config.guild.id), { body: guild })
      await this.client.rest.put(Routes.applicationCommands(this.client.user.id), { body: global })
   }

   setPresence() {
      const states = [
         '✦ From Ryo.o With ❤️‍🔥',
         '✦ Musou Isshin ⚡',
         '✦ Mlem Dango 🍡',
         '✦ Booba Saga 🌻',
         '✦ Hypnotized 🫧',
         '✦ Eternity 🪐',
      ]

      setInterval(() => {
         this.client.user.setPresence({
            status: Math.random() < 0.4 ? 'online' : 'idle',
            activities: states.map(state => ({ type: 4, name: state })),
         })
      }, 60000)
   }

   initGreeting() {
      this.client.greeting = [
         new EmbedBuilder()
            .setColor(this.config.embed.color)
            .setThumbnail(this.config.embed.thumbnail)
            .setDescription(
               '✦ Wish you a happy music time, moah moah\n' +
                  '✦ Click buttons below for more info\n' +
                  '✦ From Pooba Saga with luv\n' +
                  '✦ ' + this.client.user.username + ' :3'
            ),

         new ActionRowBuilder().addComponents(
            new ButtonBuilder({ label: '✦ Vote For Me', style: 5 }).setURL(this.config.invite.vote).setDisabled(!this.client.isEi),
            new ButtonBuilder({ label: '✦ Invite Me', style: 5 }).setURL(this.config.invite.url).setDisabled(!this.client.isEi),
            new ButtonBuilder({ label: '✦ Support Server', style: 5 }).setURL(this.config.invite.guild),
         ),
      ]
   }
}