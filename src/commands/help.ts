import { MessageContext } from 'vk-io';

export async function handleHelpCommand(context: MessageContext) {
    const helpText = `🤖 Доступные команды:\n\n/recipe [название] — поиск рецепта (искать нужно на английском, например: /recipe pasta)\n/random — получить случайный рецепт\n/history — ваша история запросов\n/help — это сообщение справки`;
    await context.send(helpText);
}
