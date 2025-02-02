const { Client, GatewayIntentBits } = require('discord.js')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')
const { YouTubePlugin } = require('@distube/youtube')
const { DisTube } = require('distube')
const fs = require('fs/promises')
const ffmpeg = require('ffmpeg-static')
const config = require('./config')

class MeowApp extends Client {
   constructor(config) {
      super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] })

      this.config = config
      this.player = new DisTube(this, {
         nsfw: true,
         ffmpeg: { path: ffmpeg },
         plugins: [new YouTubePlugin({ cookies: this.config.cookies }), new SpotifyPlugin(), new SoundCloudPlugin()],
      })

      this.commands = new Map()
      this.buttons = new Map()
      this.interface = [[], []]

      this.loadModules(`${__dirname}/../Events/Client`, (event) => this.loadEvents(this, event))
      this.loadModules(`${__dirname}/../Events/Distube`, (event) => this.loadEvents(this.player, event))
      this.loadModules(`${__dirname}/../Commands/Admin`, (command) => this.loadCommands(0, command))
      this.loadModules(`${__dirname}/../Commands/Music`, (command) => this.loadCommands(1, command))
      this.loadModules(`${__dirname}/../Controller`, (button) => this.loadButtons(button))

      this.login(this.config.token)
      require('http').createServer((req, res) => res.end()).listen(4000)
   }

   async loadModules(path, callback) {
      const files = await fs.readdir(path)

      files.forEach((file) => {
         const Module = require(`${path}/${file}`)
         callback(new Module(this))
      })
   }

   loadEvents(emitter, event) {
      emitter.on(event.name, event.execute.bind(event))
   }
   loadCommands(index, command) {
      this.interface[index].push(command.data)
      this.commands.set(command.data.name, command)
   }
   loadButtons(button) {
      this.buttons.set(button.name, button)
   }
}

module.exports = new MeowApp(config)