const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')
const { Playlist } = require('distube')
const { google } = require('googleapis')

// #region Function
module.exports = {
   isAdmin,
   isOwner,
   isMainGuild,
   strict,
   auth,
   reject,
   handleCommand,
   handleModalSubmit,
   updateDescription,
   autoJoin,
   unDeaf,
   getAddSongEmbed,
   getAddListEmbed,
   playMusic,
   description,
   getSeconds,
   removeMessage,
   capFirstChar,
   formatTime,
   updateEmbed,
   updateButtons,
   isFit,
   generateQueuePage,
   queueActionRow,
   sendErrorEmbed,
   emitError,
   printData,
}

function isAdmin(interaction) {
   return interaction.user.id === interaction.client.config.admin.id
}
function isOwner(interaction) {
   return interaction.user.id === interaction.client.config.owner.id
}
function isMainGuild(id, guildId) {
   return id === guildId
}
function hasRole(interaction) {
   return interaction.client.config.users.roles.some((id) => interaction.member.roles.cache.has(id))
}

async function strict(interaction) {
   return removeMessage(await interaction.reply({ content: 'Im Sleeping :3' }), 10000)
}

// #region Auth
function auth(interaction) {
   if (
      isMainGuild(interaction.guild.id, interaction.client.config.guild.id) &&
      (isOwner(interaction) || isAdmin(interaction) || hasRole(interaction))
   ) {
      return true
   } else if (!isMainGuild(interaction.guild.id, interaction.client.config.guild.id)) {
      return true
   } else {
      return false
   }
}
async function reject(interaction, type) {
   try {
      const data = `I'm sleeping <@${interaction.user.id}>, Call <@${interaction.client.config.owner.id}> Please ❤️‍🔥`
      if (type === 1) await interaction.channel.send(data)
      else await interaction.reply({ content: data })
   } catch (error) {
      console.log('❌   ✦ 🍕 Reject Error\n', error)
   }
}

// #region interactionCreate
async function handleCommand(interaction) {
   if (!auth(interaction)) return reject(interaction, 0)
   await interaction.deferReply()

   const embed = new EmbedBuilder().setColor(interaction.client.config.embed.color)
   const command = interaction.client.commands.get(interaction.commandName)

   if (command.inVoice && !interaction.member.voice.channelId) {
      embed.setDescription('✦ Please Join Voice Channel')
      return removeMessage(await interaction.editReply({ embeds: [embed] }), 10000)
   }

   try {
      await command.run(interaction, embed)
   } catch (error) {
      console.log(`❌ ✦ [At handleCommand()]`, error)
   }
}

async function handleModalSubmit(interaction) {
   if (!auth(interaction)) return reject(interaction, 0)
   await interaction.deferReply()

   const embed = new EmbedBuilder().setColor(interaction.client.config.embed.color)
   await addModal(interaction, embed)
}

// #region Add Modal
async function addModal(interaction, embed) {
   const query = interaction.fields.getTextInputValue('playerAddInput').split('--')

   if (!interaction.member.voice.channel) {
      removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ Please join voice channel')] }), 5000)
   } else {
      const msg = await interaction.editReply({ embeds: [embed.setDescription('✦ Meowing')] })

      await playMusic(interaction, query[0], query[1])
      removeMessage(msg, 3000)
   }
}

// #region voiceStateUpdate
async function updateDescription(client, oldState, newState) {
   if (newState.id === client.user.id) {
      const oldQueue = client.player.getQueue(oldState.guild.id)
      const newQueue = client.player.getQueue(newState.guild.id)

      if (oldQueue && newQueue && oldQueue.textChannel === newQueue.textChannel) {
         if (newQueue.playerEmbed) {
            newQueue.playerEmbed.setDescription(newQueue.playerEmbed.data.description.replace(/<#\d+>/, `<#${newState.channelId}>`))
         }
         updateEmbed(newQueue)
      }
   }
}
async function autoJoin(client, oldState, newState) {
   try {
      if (newState.member.id !== client.config.owner.id) return

      if (newState.channelId && newState.channelId !== oldState.channelId) {
         await client.player.voices.join(newState.channel).catch(() => {})
      }
   } catch (error) {
      console.error('❌   ✦ 🍉 AutoJoin Error\n', error)
   }
}

async function unDeaf(queue) {
   if (queue && queue.voice.selfDeaf) await queue.voice.setSelfDeaf(false)
}

// #region addEmbed
function getAddSongEmbed(client, song) {
   return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setThumbnail(song.thumbnail)
      .setDescription(`✦ Added [${song.name}](${song.url})\n✦ From ${capFirstChar(song.source)}・Requested by <@${song.user.id}>`)
}
function getAddListEmbed(client, list) {
   return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setThumbnail(list.thumbnail)
      .setDescription(
         `✦ Added [${list.name}](${list.url}) with ${list.songs.length} songs\n✦ From ${capFirstChar(list.source)}・Requested by <@${list.user.id}>`
      )
}

// #region playMusic
async function playMusic(interaction, name, position) {
   const isMix = name.includes('&list=RD')
   //const isPlaylist = name.includes('playlist?list=')
   //const cacheKey = isMix ? 'Mix' : isPlaylist ? 'Playlist' : 'Song'
   //const cachedItem = interaction.client.cache[`get${cacheKey}`](name)

   //if (cachedItem) {
   //await playSong(interaction, cachedItem, position)
   //} else {
   if (isMix) {
      const playList = await getMix(name, interaction.client.config.api, interaction.client.player.handler)
      name = playList
      //interaction.client.cache.addMix(name, playList)
   }
   //else if (isPlaylist) {
   //interaction.client.cache.addPlaylist(name)
   //} else {
   //interaction.client.cache.addSong(name)
   //}
   await playSong(interaction, name, position)
   //}
}
async function playSong(interaction, name, position) {
   await interaction.client.player
      .play(interaction.member.voice.channel, name, {
         position,
         member: interaction.member,
         textChannel: interaction.channel,
      })
      .catch(async (error) => {
         emitError(__filename, error)
      })
}
async function getMix(url, api, handler) {
   try {
      const response = await google.youtube('v3').playlistItems.list({
         part: 'snippet',
         playlistId: url.match(/list=([a-zA-Z0-9_-]+)/)[1],
         maxResults: 21,
         key: api,
      })

      const urls = response.data.items.map((item) => `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`)
      const songs = await Promise.all(Array.from(urls).map((url) => handler.resolve(url)))
      return new Playlist({ source: 'youtube', songs, name: 'Youtube Mix', url, thumbnail: songs[0].thumbnail })
   } catch {
      return url
   }
}
// async function getMix(url, handler) {
//    try {
//       const response = await fetch(url)
//       const data = await response.text()
//       const urls = new Set()
//       const regex = /\/watch\?v=([\w-]+)/g
//       let match

//       while ((match = regex.exec(data)) !== null) {
//          urls.add(`https://www.youtube.com/watch?v=${match[1]}`)
//       }

//       const songs = await Promise.all(Array.from(urls).map((url) => handler.resolve(url)))
//       return new Playlist({ source: 'youtube', songs, name: 'Youtube Mix', url, thumbnail: songs[0].thumbnail })
//    } catch (error) {
//       console.log('❌   ✦ 🍕 GetVideoUrls Error\n', error)
//       return url
//    }
// }

// #region Filter
function description(queue) {
   return (
      `✦ ${hasFilter(queue, '3d')}・3D\n` +
      `✦ ${hasFilter(queue, 'haas')}・Stereo\n` +
      `✦ ${hasFilter(queue, 'vaporwave')}・Slowed\n` +
      `✦ ${hasFilter(queue, 'nightcore')}・Nightcore`
   )
}
function hasFilter(queue, filter) {
   return queue.filters.has(filter) ? '✅' : '❌'
}

// #region Seek
function getSeconds(str) {
   if (!str) return 0

   const timeUnits = { h: 3600, m: 60, s: 1 }
   const timeParts = str.split(' ')

   let totalSeconds = 0
   for (const part of timeParts) {
      const match = part.match(/^(\d+)([hms])$/)
      if (!match) return NaN

      const value = parseInt(match[1])
      const unit = match[2]

      totalSeconds += value * timeUnits[unit]
   }
   return totalSeconds
}

// #region removeMessage
function removeMessage(message, time) {
   setTimeout(async () => {
      try {
         if (message) await message.delete().catch(() => {})
      } catch (error) {
         console.log(error)
      }
   }, time)
}
// #region capFirstChar
function capFirstChar(string) {
   if (!string) return ' '
   return string.charAt(0).toUpperCase() + string.slice(1)
}

function formatTime(seconds, isLive) {
   if (seconds === 0 && isLive !== false) return 'Live'

   const timeUnits = [
      { unit: 'd', value: 86400 },
      { unit: 'h', value: 3600 },
      { unit: 'm', value: 60 },
      { unit: 's', value: 1 },
   ]

   let timeParts = []
   for (let { unit, value } of timeUnits) {
      if (seconds >= value) {
         let amount = (seconds / value) | 0
         seconds %= value
         timeParts.push(amount + unit)
      }
   }

   return timeParts.length ? timeParts.join(' ') : '0s'
}

// #region updateMessage
async function updateEmbed(queue) {
   try {
      if (queue.playerMessage) await queue.playerMessage.edit({ embeds: [queue.playerEmbed.setTimestamp()] })
   } catch (error) {
      //console.log('❌   ✦ 🍕 UpdateEmbed Error\n', error)
   }
}
async function updateButtons(queue) {
   try {
      if (queue.playerMessage) await queue.playerMessage.edit({ components: queue.actionRows })
   } catch (error) {
      //console.log('❌   ✦ 🍕 UpdateButtons Error\n', error)
   }
}

// #region checkImage
async function isFit(url) {
   try {
      const response = await fetch(url, { method: 'HEAD' })
      return parseInt(response.headers.get('Content-Length'), 10) > 40000
   } catch {
      return false
   }
}

// #region Loop


// #region Queue
function generateQueuePage(client, queue, start, page, total, pageLength, songList) {
   let index = start + 1
   const current = songList.slice(start, start + pageLength)
   return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: client.config.embed.author.queue, iconURL: queue.textChannel.guild.iconURL() })
      .setDescription(current.map((song) => `\n${index++}. [${song.name}](${song.url})・${formatTime(song.duration, song.isLive)}`).join(''))
      .setFooter({ text: `🥪 • Page ${page} / ${total}` })
}
function queueActionRow(page, total) {
   return new ActionRowBuilder().addComponents(
      new ButtonBuilder({ custom_id: 'queueFirst', label: 'First Page', style: 2 }).setDisabled(page === 1),
      new ButtonBuilder({ custom_id: 'queueBack', label: 'Previous Page', style: 2 }).setDisabled(page === 1),
      new ButtonBuilder({ custom_id: 'queueNext', label: 'Next Page', style: 2 }).setDisabled(page === total),
      new ButtonBuilder({ custom_id: 'queueLast', label: 'Last Page', style: 2 }).setDisabled(page === total),
      new ButtonBuilder({ custom_id: 'queueClose', label: 'Close', style: 4 })
   )
}

// #region showModal


// #region sendError
async function sendErrorEmbed(interaction, embed) {
   removeMessage(await interaction.editReply({ embeds: [embed.setDescription('✦ Something went wrong. Please try reconnecting me ><')] }), 10000)
}
function emitError(file, error) {
   console.log(`❌ ✦ [At ${file}]`, error)
}

// #region Guild
async function createGuild(token) {
   try {
      const serverName = `B-${Math.floor(100000 + Math.random() * 900000)}`

      const headers = {
         'Content-Type': 'application/json',
         Authorization: `Bot ${token}`,
      }
      const data = {
         name: serverName,
         icon: null,
         channels: [],
         system_channel_id: null,
      }
      const response = await fetch(`https://discord.com/api/v9/guilds`, {
         method: 'POST',
         headers: headers,
         body: JSON.stringify(data),
      })

      if (!response.ok) return 'Failed to create server'

      const guildData = await response.json()
      return `Created server: ID: ${guildData.id} | Name: ${serverName}`
   } catch (error) {
      return 'Error creating server:', error
   }
}

async function leaveGuild(client, guildId) {
   try {
      const guild = await client.guilds.fetch(guildId)
      guild.ownerId === client.user.id ? await guild.delete() : await guild.leave()

      console.log(`Successfully left the guild: ID: ${guild.id} | Name: ${guild.name}`)
   } catch (error) {
      console.log(`Failed to leave or delete the guild: ${guildId}`, error)
   }
}

function listGuilds(client, interaction) {
   let index = 1
   client.guilds.cache.forEach(async (guild) => {
      await interaction.channel.send(`\`\`\`${index}. ID: ${guild.id}      | Name: ${guild.name}\`\`\``)
      index++
   })
}

function printData(data) {
   console.log('✦ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✦')
   console.log(data)
   console.log('✦ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ✦')
}
