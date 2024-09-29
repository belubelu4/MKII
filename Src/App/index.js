const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const { YouTubePlugin } = require('@distube/youtube')
const { DisTube } = require('distube')
const fs = require('fs').promises

module.exports = class MeowApp extends Client {
   constructor(config) {
      super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] })

      this.config = config
      this.player = new DisTube(this, { nsfw: true, plugins: [new YouTubePlugin(), new SpotifyPlugin(), new SoundCloudPlugin()] })
      this.commands = new Collection()
      this.buttons = new Collection()
      this.chats = new Collection()
      this.interface = [[], []]

      Promise.all([
         this.loadEvents(__dirname + '/../Events/Client'),
         this.loadEvents(__dirname + '/../Events/Distube'),
         this.loadCommands(__dirname + '/../Commands/Admin'),
         this.loadCommands(__dirname + '/../Commands/Music'),
         this.loadChats(__dirname + '/../Chats'),
         this.loadButtons(__dirname + '/../Controller'),
      ])

      this.login(config.token).catch(() => this.login(config.token))
   }

   arise() {
      require('express')().get('/', (_, res) => res.send('🪐')).listen(4000)

      process.env.YTDL_NO_UPDATE = true
      process.env.YTSR_NO_UPDATE = true
   }

   async loadModules(path, callback) {
      try {
         const files = await fs.readdir(path)
         await Promise.all(
            files.map(async (file) => {
               const Module = require(`${path}/${file}`)
               await callback(new Module(this))
            })
         )
      } catch (error) {
         console.log(error)
      }
   }

   async loadEvents(path) {
      const emitter = path.includes('Client') ? this : this.player

      await this.loadModules(path, async (event) => {
         emitter.on(event.name, event.run.bind(event))
      })
   }

   async loadCommands(path) {
      const i = path.includes('Admin') ? 0 : 1

      await this.loadModules(path, async (command) => {
         this.interface[i].push(command.data)
         this.commands.set(command.data.name, command)
      })
   }

   async loadChats(path) {
      await this.loadModules(path, async (chat) => {
         this.chats.set(chat.data.name, chat)
      })
   }

   async loadButtons(path) {
      await this.loadModules(path, async (button) => {
         this.buttons.set(button.name, button)
      })
   }
}