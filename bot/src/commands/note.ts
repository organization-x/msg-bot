import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { prisma } from 'bot-prisma';

@Discord()
export class Note {
  @Slash({ description: 'Send daily update' })
  async note(
    @SlashOption({
      description: 'Message',
      name: 'message',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction
  ):Promise<void> {
    // Create a new note in the database
    await prisma.note.create({
      data: {
        message: message,
        authorId: BigInt(interaction.user.id),
      },
    }).catch((error) => {
      // Handle any errors that occurred during the database operation
      interaction.reply('There was an error saving your note.');
    });

    // Send a confirmation message to the user
    await interaction.reply('Your note has been added to the database!');
  }
}