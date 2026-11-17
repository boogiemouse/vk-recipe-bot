// src/commands/recipe.ts
import { MessageContext } from 'vk-io';
import { searchRecipe, getRandomRecipe } from '../api/mealApi';
import { PrismaClient } from '@prisma/client';

// Инициализируем клиент базы данных
const prisma = new PrismaClient();

export async function handleRecipeCommand(context: MessageContext) {
    // Получаем текст после команды /recipe (например, "/recipe паста" -> "паста")
    const query = context.text?.replace('/recipe', '').trim();

    // Обработка некорректного ввода (если написали просто /recipe)
    if (!query) {
        return context.send('⚠️ Пожалуйста, укажите название блюда. Пример: /recipe паста');
    }

    try {
        await context.send('🔍 Ищу рецепт, подождите...');
        
        // Ищем рецепт через API
        const recipe = await searchRecipe(query);

        if (!recipe) {
            // Обработка ситуации, когда ничего не найдено
            return context.send(`😔 По запросу "${query}" ничего не найдено. Попробуйте другое название.`);
        }

        // Отправляем результат пользователю
        await context.send(recipe);

        // СОХРАНЯЕМ В ИСТОРИЮ (в базу данных)
        await prisma.requestHistory.create({
            data: {
                userId: context.senderId,
                command: '/recipe',
                query: query
            }
        });

    } catch (error) {
        // Обработка ошибок внешнего API
        console.error(error);
        await context.send('❌ Произошла ошибка при получении рецепта. Попробуйте позже.');
    }
}

export async function handleRandomCommand(context: MessageContext) {
    try {
        await context.send('🎲 Ищу случайный рецепт, секунду...');
        const recipe = await getRandomRecipe();
        
        await context.send(recipe);

        // Сохраняем в историю
        await prisma.requestHistory.create({
            data: {
                userId: context.senderId,
                command: '/random',
                query: 'Случайный рецепт'
            }
        });
    } catch (error) {
        await context.send('❌ Не удалось получить случайный рецепт. Попробуйте позже.');
    }
}