module.exports = class Event {
   constructor(client) {
      this.client = client
      this.name = 'cc'
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

   async run(...args) {
      throw new Error('Method "run()" must be implemented')
   }
}