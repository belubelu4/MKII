module.exports = class Command {
   constructor(client, inVoice = false) {
      this.client = client
      this.inVoice = inVoice
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