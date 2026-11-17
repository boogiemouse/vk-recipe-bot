export async function searchRecipe(query: string): Promise<string | null> {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const data = await response.json();
        if (!data.meals || data.meals.length === 0) {
            return null;
        }
        const meal = data.meals[0];
        return `🍽 Название: ${meal.strMeal}\n🌍 Кухня: ${meal.strArea || 'Неизвестно'}\n📂 Категория: ${meal.strCategory}\n\n📝 Инструкция (кратко):\n${meal.strInstructions.substring(0, 300)}...`;
    } catch (error) {
        console.error('Ошибка API:', error);
        throw new Error('Не удалось получить данные от внешнего API');
    }
}

export async function getRandomRecipe(): Promise<string> {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) throw new Error('Ошибка сети');
        const data = await response.json();
        const meal = data.meals[0];
        return `🎲 Случайный рецепт:\n🍽 Название: ${meal.strMeal}\n🌍 Кухня: ${meal.strArea || 'Неизвестно'}\n📂 Категория: ${meal.strCategory}\n\n📝 Инструкция (кратко):\n${meal.strInstructions.substring(0, 300)}...`;
    } catch (error) {
        console.error('Ошибка API:', error);
        throw new Error('Не удалось получить случайный рецепт');
    }
}