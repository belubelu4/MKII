const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('discord.js')
const Button = require('../Structures/Button')

module.exports = class PlayerAdd extends Button {
   constructor(client) {
      super(client, 'playerAdd')
   }

   async run(interaction) {
      await this.showModal(interaction, 'playerAddModal', '✦ Add Music', 'playerAddInput', '✦ Name', 'Enter name or link')
   }

   async showModal(interaction, customId, title, inputId, label, placeholder) {
      const textInput = new TextInputBuilder().setCustomId(inputId).setLabel(label).setStyle('Short').setPlaceholder(placeholder)
      const modal = new ModalBuilder().setCustomId(customId).setTitle(title).addComponents(new ActionRowBuilder().addComponents(textInput))
      await interaction.showModal(modal)
   }
}