const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')
const { Playlist } = require('distube')
const { google } = require('googleapis')

// #region Function
module.exports = {
   isMainGuild,
   updateDescription,
   autoJoin,
   unDeaf,
   getAddSongEmbed,
   getAddListEmbed,
   playMusic,
   description,
   getSeconds,
   formatTime,
   isFit,
   generateQueuePage,
   queueActionRow,
}

// #region playMusic
async function playMusic(interaction, name, position) {
   const isMix = name.includes('&list=RD')

   if (isMix) name = await getMix(name, interaction.client.config.api, interaction.client.player.handler)
   await playSong(interaction, name, position)
}
async function playSong(interaction, name, position) {
   await interaction.client.player.play(interaction.member.voice.channel, name, {
      position,
      member: interaction.member,
      textChannel: interaction.channel,
   }).catch((error) => console.log(error))
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

// #region addEmbed
function getAddSongEmbed(client, song) {
   return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setThumbnail(song.thumbnail)
      .setDescription(`✦ Added [${song.name}](${song.url.split('&list=')[0]})\n✦ From ${song.source}・Requested by <@${song.user.id}>`)
}
function getAddListEmbed(client, list) {
   return new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setThumbnail(list.thumbnail)
      .setDescription(
         `✦ Added [${list.name}](${list.url}) with ${list.songs.length} songs\n✦ From ${list.source}・Requested by <@${list.user.id}>`
      )
}

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
      new ButtonBuilder({ custom_id: 'queueFirst', label: '✦ First', style: 2 }).setDisabled(page === 1),
      new ButtonBuilder({ custom_id: 'queueBack', label: '✦ Previous', style: 2 }).setDisabled(page === 1),
      new ButtonBuilder({ custom_id: 'queueNext', label: '✦ Next', style: 2 }).setDisabled(page === total),
      new ButtonBuilder({ custom_id: 'queueLast', label: '✦ Last', style: 2 }).setDisabled(page === total),
      new ButtonBuilder({ custom_id: 'queueClose', label: '✦ Close', style: 4 })
   )
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
async function updateEmbed(queue) {
   try {
      if (queue.playerMessage) await queue.playerMessage.edit({ embeds: [queue.playerEmbed.setTimestamp()] })
   } catch (error) {
      //console.log('❌   ✦ 🍕 UpdateEmbed Error\n', error)
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

function isMainGuild(id, guildId) {
   return id === guildId
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