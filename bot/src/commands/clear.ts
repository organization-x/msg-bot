import type { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

import { prisma } from 'bot-prisma';

@Discord()
export class Launch {
  @Slash({ description: 'Clear channel from daily updates' })
  clear(
    interaction: CommandInteraction
  ): void {
    (
      async function() {
        const getChannel = await prisma.channel.findUnique(
          {
            where: {
              channelId: BigInt(interaction.channelId)
            }
          }
        );

        if(!getChannel) interaction.reply('Error, channel is not registered. ');
        else {
          await prisma.channel.delete(
            {
              where: {
                channelId: BigInt(getChannel.channelId)
              }
            }
          );

          interaction.reply('Channel cleared.');
        }
      }
    )();
  }
}
