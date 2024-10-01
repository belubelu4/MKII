module.exports = class Button {
   constructor(client) {
      this.client = client
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
}