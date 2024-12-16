// Enum для типів героїв
enum HeroType {
    Warrior = "WARRIOR",
    Mage = "MAGE",
    Archer = "ARCHER"
}

// Enum для типів атак
enum AttackType {
    Physical = "PHYSICAL",
    Magical = "MAGICAL",
    Ranged = "RANGED"
}

// Interface для характеристик героя
interface HeroStats {
    health: number;
    attack: number;
    defense: number;
    speed: number;
}

// Interface для героя
interface Hero {
    id: number;
    name: string;
    type: HeroType;
    attackType: AttackType;
    stats: HeroStats;
    isAlive: boolean;
}

// Type для результату атаки
type AttackResult = {
    damage: number;
    isCritical: boolean;
    remainingHealth: number;
};

// Функція створення нового героя
function createHero(name: string, type: HeroType): Hero {
    const baseStats: Record<HeroType, HeroStats> = {
        [HeroType.Warrior]: { health: 120, attack: 20, defense: 15, speed: 10 },
        [HeroType.Mage]: { health: 80, attack: 30, defense: 10, speed: 15 },
        [HeroType.Archer]: { health: 100, attack: 25, defense: 12, speed: 20 }
    };

    const attackTypes: Record<HeroType, AttackType> = {
        [HeroType.Warrior]: AttackType.Physical,
        [HeroType.Mage]: AttackType.Magical,
        [HeroType.Archer]: AttackType.Ranged
    };

    return {
        id: Date.now(), // Унікальний id
        name,
        type,
        attackType: attackTypes[type],
        stats: baseStats[type],
        isAlive: true
    };
}

// Функція розрахунку пошкодження
function calculateDamage(attacker: Hero, defender: Hero): AttackResult {
    const baseDamage = attacker.stats.attack - defender.stats.defense;
    const damage = Math.max(baseDamage, 0);
    const isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    const finalDamage = isCritical ? damage * 2 : damage;
    const remainingHealth = Math.max(defender.stats.health - finalDamage, 0);

    return {
        damage: finalDamage,
        isCritical,
        remainingHealth
    };
}

// Generic функція для пошуку героя в масиві
function findHeroByProperty<T extends keyof Hero>(
    heroes: Hero[],
    property: T,
    value: Hero[T]
): Hero | undefined {
    return heroes.filter(hero => hero[property] === value)[0];
}


// Функція проведення раунду бою між героями
function battleRound(hero1: Hero, hero2: Hero): string {
    if (!hero1.isAlive || !hero2.isAlive) {
        return `Один із героїв вже мертвий. Бій неможливий.`;
    }

    // Хто атакує першим залежить від швидкості
    const firstAttacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    const secondAttacker = firstAttacker === hero1 ? hero2 : hero1;

    // Атака першого героя
    const attack1 = calculateDamage(firstAttacker, secondAttacker);
    secondAttacker.stats.health = attack1.remainingHealth;
    secondAttacker.isAlive = secondAttacker.stats.health > 0;

    let result = `${firstAttacker.name} атакує ${secondAttacker.name}. Завдано ${attack1.damage} шкоди`;
    if (attack1.isCritical) result += " (Критичний удар!)";
    result += `. У ${secondAttacker.name} залишилось ${attack1.remainingHealth} здоров'я.`;

    if (!secondAttacker.isAlive) {
        result += ` ${secondAttacker.name} загинув.`;
        return result;
    }

    // Атака другого героя, якщо він ще живий
    const attack2 = calculateDamage(secondAttacker, firstAttacker);
    firstAttacker.stats.health = attack2.remainingHealth;
    firstAttacker.isAlive = firstAttacker.stats.health > 0;

    result += `\n${secondAttacker.name} атакує ${firstAttacker.name}. Завдано ${attack2.damage} шкоди`;
    if (attack2.isCritical) result += " (Критичний удар!)";
    result += `. У ${firstAttacker.name} залишилось ${attack2.remainingHealth} здоров'я.`;

    if (!firstAttacker.isAlive) {
        result += ` ${firstAttacker.name} загинув.`;
    }

    return result;
}

// Демонстрація застосування
const heroes: Hero[] = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леона", HeroType.Archer)
];

// Пошук героя за типом
const warrior = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log("Знайдений герой:", warrior);

// Проведення бою
if (heroes[0] && heroes[1]) {
    const battleLog = battleRound(heroes[0], heroes[1]);
    console.log("Результат бою:", battleLog);
}

// Вивід статистики героїв
console.log("Статистика героїв після бою:", heroes);
