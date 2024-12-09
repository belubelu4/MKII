module.exports = class Event {
   constructor(client, name) {
      this.client = client
      this.name = name
   }

   get player() {
      return this.client.player
   }

   get commands() {
      return this.client.commands
   }

   get chats() {
      return this.client.chats
   }

   get buttons() {
      return this.client.buttons
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
