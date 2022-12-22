import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, Role } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

import { prisma } from 'bot-prisma';

@Discord()
export class Launch {
  @Slash({ description: 'Register channel for daily updates' })
  async register(
    @SlashOption({
      description: 'Role',
      name: 'role',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    interaction: CommandInteraction
  ): Promise<void> {
    const getChannel = await prisma.channel.findUnique(
      {
        where: {
          channelId: BigInt(interaction.channelId)
        }
      }
    );

    if(getChannel) await interaction.reply('Error, this channel is already registered. Please use /clear if you want to re-register it.');
    else {
      await prisma.channel.create(
        {
          data: {
            channelId: BigInt(interaction.channelId),
            roleId: BigInt(role.id)
          }
        }
      );
      
      await interaction.reply('Channel registered.');
    }
  }
}
