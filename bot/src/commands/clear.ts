import type { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

import { prisma } from 'bot-prisma';

@Discord()
export class Launch {
  @Slash({ description: 'Clear channel from daily updates' })
  async clear(
    interaction: CommandInteraction
  ): Promise<void> {
    const getChannel = await prisma.channel.findUnique(
      {
        where: {
          channelId: BigInt(interaction.channelId)
        }
      }
    );

    if(!getChannel) await interaction.reply('Error, channel is not registered for daily updates.');
    else {
      await prisma.channel.delete(
        {
          where: {
            channelId: BigInt(getChannel.channelId)
          }
        }
      );

      await interaction.reply('Channel cleared.');
    }
  }
}
