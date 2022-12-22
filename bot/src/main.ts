import { dirname, importx } from '@discordx/importer';
import { Interaction, Message, TextChannel } from 'discord.js';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';

import { prisma } from 'bot-prisma';

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
  silent: process.env.DEBUG === 'true',
  simpleCommand: {
    prefix: '!',
  },
});

bot.once('ready', async () => {
  await bot.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  setInterval(async () => {
    const channels = await prisma.channel.findMany();

    for(let channel of channels) {
      const channelObj = await bot.channels.fetch(String(channel.channelId)) as TextChannel;
      
      let today = new Date();
      let localOffset = -(today.getTimezoneOffset() / 60);
      let pstOffset = -8;
      let offset = pstOffset - localOffset;
      let date = new Date( new Date().getTime() + offset * 3600 * 1000)
      
      if(date.getHours() !== 9) return;

      let message;

      if(date.getDay() !== 0 && date.getDay() !== 6) message = channelObj.send(`<@&${ channel.roleId }> Please send your daily updates here!`);
      else message = channelObj.send('Please send your daily updates here!');

      (await message).startThread(
        {
          name: `${ (new Date()).toLocaleDateString('en-US').replaceAll('/', '-') } daily updates`
        }
      );
    }
  }, 3.6e+6); // repeat every hour

  console.log('Bot started');
});

bot.on('interactionCreate', async (interaction: Interaction) => {
  bot.executeInteraction(interaction);

  if(interaction.isModalSubmit()) {
    const getChannel = await prisma.channel.findUnique(
      {
        where: {
          channelId: BigInt(interaction.channelId!)
        }
      }
    );

    const userNote = await prisma.note.create(
      {
        data: {
          message: interaction.fields.fields.get('updateInput')!.value,
          authorId: BigInt(interaction.user.id),
          channelId: getChannel!.channelId
        }
      }
    );

    await prisma.channel.update(
      {
        where: {
          channelId: getChannel!.channelId
        },
        data: {
          notes: {
            connect: {
              id: userNote.id
            }
          }
        }
      }
    );

    await interaction.reply('Your note has been added to the database!');
  }
});

bot.on('messageCreate', (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  if (!process.env.BOT_TOKEN) throw Error('Could not find BOT_TOKEN in your environment');

  await importx(`${ dirname(import.meta.url) }/{events,commands}/**/*.{ts,js}`);
  await bot.login(process.env.BOT_TOKEN);
}

run();
