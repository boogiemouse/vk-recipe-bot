import { MessageContext } from 'vk-io';
import { searchRecipe, getRandomRecipe } from '../api/mealApi';
import { prisma } from '../database/prisma';

export async function handleRecipeCommand(context: MessageContext) {
    const query = context.text?.replace('/recipe', '').trim();

    if (!query) {
        return context.send('⚠️ Пожалуйста, укажите название блюда. Пример: /recipe pasta');
    }

    try {
        await context.send('🔍 Ищу рецепт, подождите...');

        await prisma.requestHistory.create({
            data: {
                userId: context.senderId,
                command: '/recipe',
                query: query
            }
        });

        const recipe = await searchRecipe(query);

        if (!recipe) {
            return context.send(`😔 По запросу "${query}" ничего не найдено. Попробуйте другое название.`);
        }

        await context.send(recipe);

    } catch (error) {
        console.error(error);
        await context.send('❌ Произошла ошибка при получении рецепта. Попробуйте позже.');
    }
}

export async function handleRandomCommand(context: MessageContext) {
    try {
        await context.send('🎲 Ищу случайный рецепт, секунду...');
        const recipe = await getRandomRecipe();
        
        await context.send(recipe);

        await prisma.requestHistory.create({
            data: {
                userId: context.senderId,
                command: '/random',
                query: 'Случайный рецепт'
            }
        });
    } catch (error) {
        console.error(error);
        await context.send('❌ Не удалось получить случайный рецепт. Попробуйте позже.');
    }
}
