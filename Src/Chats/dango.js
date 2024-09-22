const { emitError } = require('../Functions')
const Chat = require('../Structures/Chat')

module.exports = class Dango extends Chat {
   constructor(client) {
      super(client)
      this.data = {
         name: 'dango đâu',
      }
   }

   async run(message, args) {
      try {
         await message.channel.send(`Dạ đây ạ 🍡`)

         message.channel.send(
            'https://cdn.discordapp.com/attachments/1236634193019277322/1272789846913454122/recipes-693-three-colour-dango-dumplings.png?ex=66bc416a&is=66baefea&hm=aaa4045f27f21dadd4ba6d89d2ed362373ef5e2a293457ba03b1051116479a27&'
         )
      } catch (error) {
         emitError(__filename, error)
      }
   }
}
