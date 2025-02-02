module.exports = class Command {
   constructor(client) {
      this.client = client
      this.isAdmin = false
      this.inVoice = false
   }

   get config() {
      return this.client.config
   }

   get player() {
      return this.client.player
   }

   async run(...args) {}

   async execute(...args) {
      try {
         await this.run(...args)
      } catch (error) {
         console.log(error)
      }
   }

   removeMessage(message, time) {
      setTimeout(async () => {
         try {
            if (message) await message.delete().catch(() => {})
         } catch (error) {
            // console.log(error)
         }
      }, time)
   }
}
