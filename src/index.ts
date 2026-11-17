import { VK } from 'vk-io';
import * as dotenv from 'dotenv';

import { handleRecipeCommand, handleRandomCommand } from './commands/recipe';
import { handleHistoryCommand } from './commands/history';
import { handleHelpCommand } from './commands/help';

dotenv.config();

if (!process.env.VK_TOKEN) {
    console.error('ОШИБКА: Не найден VK_TOKEN в файле .env');
    process.exit(1);
}

const vk = new VK({
    token: process.env.VK_TOKEN,
});

vk.updates.on('message_new', async (context) => {
    const text = context.text?.toLowerCase().trim();

    if (!text) return;

    // Обработка команд
    if (text === '/hello-world' || text === 'привет') {
        await context.send('Привет! Я бот для поиска рецептов. Напиши /help, чтобы узнать, что я умею.');
    } else if (text.startsWith('/recipe')) {
        await handleRecipeCommand(context);
    } else if (text === '/random') {
        await handleRandomCommand(context);
    } else if (text === '/history') {
        await handleHistoryCommand(context);
    } else if (text === '/help') {
        await handleHelpCommand(context);
    } else if (text.startsWith('/')) {
        // Неизвестная команда
        await context.send('🤷‍♂️ Неизвестная команда. Напишите /help для списка доступных команд.');
    } else {
        // Если написали что-то не по командам
        await context.send('🤷‍♂️ Я вас не понял. Напишите /help для списка команд.');
    }
});

vk.updates.start().then(() => {
    console.log('✅ Бот успешно запущен и слушает сообщения!');
}).catch((error) => {
    console.error('❌ Ошибка при запуске бота:', error);
});