module.exports = class Button {
   constructor(client, name) {
      this.client = client
      this.name = name
      this.isAdmin = false
   }

   get player() {
      return this.client.player
   }

   get config() {
      return this.client.config
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