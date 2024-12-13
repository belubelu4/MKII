const { ShardingManager } = require('discord.js')
const config = require('./Src/App/config')

const manager = new ShardingManager('./Src/App/index.js', { token: config.token })
manager.on('shardCreate', (shard) => console.log('✔️    ✦ 🌑 Launched shard ' + shard.id))
manager.spawn()

//require('./Src/App')