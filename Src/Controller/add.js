const { showModal } = require('../Functions')
const Button = require('../Structures/Button')

module.exports = class PlayerAdd extends Button {
   constructor(client) {
      super(client)
      this.name = 'playerAdd'
   }

   async run(interaction) {
      try {
         await showModal(interaction, 'playerAddModal', 'Add Music', 'playerAddInput', 'Name', '✦ Enter music name or link')
      } catch (error) {
         console.log(`❌ ✦ [At ${__filename}]`, error)
      }
   }
}