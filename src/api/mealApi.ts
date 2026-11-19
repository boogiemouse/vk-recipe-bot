interface Meal {
    strMeal: string;
    strArea: string;
    strCategory: string;
    strInstructions: string;
    strMealThumb: string;
    strSource: string | null;
    [key: string]: string | null;
}

function formatMeal(meal: Meal): string {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients += `- ${ingredient} ${measure ? `(${measure.trim()})` : ''}\n`;
        }
    }

    return `🍽 Название: ${meal.strMeal}\n🌍 Кухня: ${meal.strArea || 'Неизвестно'}\n📂 Категория: ${meal.strCategory}\n\n🛒 Ингредиенты:\n${ingredients}\n📝 Инструкция (кратко):\n${meal.strInstructions}\n\n🔗 Источник: ${meal.strSource || 'Нет ссылки'}\n🖼 Фото: ${meal.strMealThumb}`;
}

export async function searchRecipe(query: string): Promise<string | null> {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Ошибка сети');
        const data = await response.json();
        if (!data.meals || data.meals.length === 0) return null;
        return formatMeal(data.meals[0]);
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
        return formatMeal(data.meals[0]);
    } catch (error) {
        console.error('Ошибка API (Random):', error);
        throw new Error('Не удалось получить случайный рецепт');
    }
}
