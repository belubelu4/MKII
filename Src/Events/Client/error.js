const Event = require('../../Structures/Event')

module.exports = class ClientError extends Event {
   constructor(client) {
      super(client, 'error')
   }

   async run(error) {
      console.log(`❌ ✦ [At ${__filename}]`, error)
   }
}
