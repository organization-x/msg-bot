import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType, Role } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { prisma } from 'bot-prisma';

@Discord()
export class Launch {
  @Slash({ description: 'Register channel for daily updates' })
  register(
    @SlashOption({
      description: 'Role',
      name: 'role',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
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

        if(getChannel) interaction.reply('Error, this channel is already registered. Please clear it if you want to re-register it.');
        else {
          await prisma.channel.create(
            {
              data: {
                channelId: BigInt(interaction.channelId),
                roleId: BigInt(role.id)
              }
            }
          );
          
          interaction.reply('Channel registered.');
        }
      }
    )();
  }
}
