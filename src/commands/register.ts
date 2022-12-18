import type { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

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
    _: string,
    interaction: CommandInteraction
  ): void {
    interaction.reply('Registeration successful!');
  }
}
