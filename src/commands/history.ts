import { MessageContext } from 'vk-io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function handleHistoryCommand(context: MessageContext) {
    try {
        // Ищем последние 5 запросов конкретного пользователя
        const history = await prisma.requestHistory.findMany({
            where: { userId: context.senderId },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        if (history.length === 0) {
            return context.send('📭 У вас пока нет сохраненных запросов. Самое время что-нибудь найти!');
        }

        let response = '📜 Ваши последние 5 запросов:\n\n';
        history.forEach((item, index) => {
            const date = item.createdAt.toLocaleString('ru-RU');
            response += `${index + 1}. [${date}] ${item.command} ${item.query ? '— ' + item.query : ''}\n`;
        });
        
        await context.send(response);
    } catch (error) {
        console.error(error);
        await context.send('❌ Ошибка при получении истории.');
    }
}