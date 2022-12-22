import type { CommandInteraction } from 'discord.js';
import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Discord, Slash } from 'discordx';

import { prisma } from 'bot-prisma';

@Discord()
export class Note {
  @Slash({ description: 'Send daily update' })
  async note(
    interaction: CommandInteraction
  ): Promise<void> {
    const getChannel = await prisma.channel.findUnique(
      {
        where: {
          channelId: BigInt(interaction.channelId)
        }
      }
    );

    if(!getChannel) {
      await interaction.reply('Channel is not registered for updates.');
      
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId('dailyUpdateModal')
      .setTitle(`${ interaction.user.username } Daily Update`);

    const updateInput = new TextInputBuilder()
      .setCustomId('updateInput')
      .setLabel('Daily Update')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const updateRow = new ActionRowBuilder().addComponents(updateInput);

    // @ts-ignore
    modal.addComponents(updateRow);

    await interaction.showModal(modal);
  }
}
