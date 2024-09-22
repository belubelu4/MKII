module.exports = class Button {
   constructor(client) {
      this.client = client
   }

   get player() {
      return this.client.player
   }

   get config() {
      return this.client.config
   }

   async run(...args) {
      throw new Error('Method "run()" must be implemented.')
   }
}