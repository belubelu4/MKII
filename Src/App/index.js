const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const { YouTubePlugin } = require('@distube/youtube')
const { DisTube } = require('distube')
const fs = require('fs/promises')
const ffmpeg = require('ffmpeg-static')
const config = require('./config')

class MeowApp extends Client {
   constructor(config) {
      super({
         intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
            // GatewayIntentBits.GuildMembers,
            // GatewayIntentBits.MessageContent,
         ],
      })

      this.config = config
      this.player = new DisTube(this, {
         nsfw: true,
         ffmpeg: { path: ffmpeg },
         plugins: [new YouTubePlugin({ cookies: this.config.cookies }), new SpotifyPlugin(), new SoundCloudPlugin()],
      })

      this.commands = new Collection()
      this.buttons = new Collection()
      // this.chats = new Collection()
      this.interface = [[], []]

      this.loadEvents(__dirname + '/../Events/Client')
      this.loadEvents(__dirname + '/../Events/Distube')
      this.loadCommands(__dirname + '/../Commands/Admin')
      this.loadCommands(__dirname + '/../Commands/Music')
      // this.loadChats(__dirname + '/../Chats')
      this.loadButtons(__dirname + '/../Controller')

      this.arise()
      this.login(this.config.token).catch(() => this.login(this.config.token))
   }

   arise() {
      require('express')().get('/', (req, res) => res.writeHead(200).end()).listen(4000)

      process.env.YTDL_NO_UPDATE = true
      process.env.YTSR_NO_UPDATE = true
   }

   async loadModules(path, callback) {
      const files = await fs.readdir(path)

      files.map(async (file) => {
         const Module = require(`${path}/${file}`)
         await callback(new Module(this))
      })
   }

   async loadEvents(path) {
      const emitter = path.includes('Client') ? this : this.player

      await this.loadModules(path, async (event) => {
         emitter.on(event.name, event.execute.bind(event))
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

module.exports = new MeowApp(config)