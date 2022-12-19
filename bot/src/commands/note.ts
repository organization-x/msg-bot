import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class Note {
  @Slash({ description: 'Send daily update' })
  note(
    @SlashOption({
      description: 'Message',
      name: 'message',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    _: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply('Daily update saved!');
  }
}
