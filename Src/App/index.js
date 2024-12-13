const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const { YouTubePlugin } = require('@distube/youtube')
const { DisTube } = require('distube')
const fs = require('fs/promises')
const config = require('./config')
// const ffmpeg = require('ffmpeg-static')   // "ffmpeg-static": "^5.2.0",

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
         // ffmpeg: { path: ffmpeg },
         plugins: [new YouTubePlugin({ cookies: this.config.cookies }), new SpotifyPlugin(), new SoundCloudPlugin()],
      })

      this.commands = new Collection()
      this.buttons = new Collection()
      // this.chats = new Collection()
      this.interface = [[], []]

      this.loadModules(__dirname + '/../Events/Client', this.loadEvents.bind(this, this))
      this.loadModules(__dirname + '/../Events/Distube', this.loadEvents.bind(this, this.player))
      this.loadModules(__dirname + '/../Commands/Admin', this.loadCommands.bind(this, 0))
      this.loadModules(__dirname + '/../Commands/Music', this.loadCommands.bind(this, 1))
      // this.loadModules(__dirname + '/../Chats', this.loadChats.bind(this))
      this.loadModules(__dirname + '/../Controller', this.loadButtons.bind(this))

      this.login(this.config.token).catch(() => this.login(this.config.token))

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

   async loadEvents(emitter, event) {
      emitter.on(event.name, event.execute.bind(event))
   }

   async loadCommands(index, command) {
      this.interface[index].push(command.data)
      this.commands.set(command.data.name, command)
   }

   async loadChats(chat) {
      this.chats.set(chat.data.name, chat)
   }

   async loadButtons(button) {
      this.buttons.set(button.name, button)
   }
}

module.exports = new MeowApp(config)