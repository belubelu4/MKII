// const config = require('./Src/config')

// if (config.shard) {
//    const { ShardingManager } = require('discord.js')
//    const manager = new ShardingManager('./Src/App/index.js', { token: config.token })
//    manager.on('shardCreate', (shard) => console.log('✔️    ✦ 🌑 Launched shard -- ' + shard.id))
//    manager.spawn()
// } else
   require('./Src/App')