// Enum для типів героїв
var HeroType;
(function (HeroType) {
    HeroType["Warrior"] = "WARRIOR";
    HeroType["Mage"] = "MAGE";
    HeroType["Archer"] = "ARCHER";
})(HeroType || (HeroType = {}));
// Enum для типів атак
var AttackType;
(function (AttackType) {
    AttackType["Physical"] = "PHYSICAL";
    AttackType["Magical"] = "MAGICAL";
    AttackType["Ranged"] = "RANGED";
})(AttackType || (AttackType = {}));
// Функція створення нового героя
function createHero(name, type) {
    var _a, _b;
    var baseStats = (_a = {},
        _a[HeroType.Warrior] = { health: 120, attack: 20, defense: 15, speed: 10 },
        _a[HeroType.Mage] = { health: 80, attack: 30, defense: 10, speed: 15 },
        _a[HeroType.Archer] = { health: 100, attack: 25, defense: 12, speed: 20 },
        _a);
    var attackTypes = (_b = {},
        _b[HeroType.Warrior] = AttackType.Physical,
        _b[HeroType.Mage] = AttackType.Magical,
        _b[HeroType.Archer] = AttackType.Ranged,
        _b);
    return {
        id: Date.now(), // Унікальний id
        name: name,
        type: type,
        attackType: attackTypes[type],
        stats: baseStats[type],
        isAlive: true
    };
}
// Функція розрахунку пошкодження
function calculateDamage(attacker, defender) {
    var baseDamage = attacker.stats.attack - defender.stats.defense;
    var damage = Math.max(baseDamage, 0);
    var isCritical = Math.random() < 0.2; // 20% шанс критичного удару
    var finalDamage = isCritical ? damage * 2 : damage;
    var remainingHealth = Math.max(defender.stats.health - finalDamage, 0);
    return {
        damage: finalDamage,
        isCritical: isCritical,
        remainingHealth: remainingHealth
    };
}
// Generic функція для пошуку героя в масиві
function findHeroByProperty(heroes, property, value) {
    return heroes.filter(function (hero) { return hero[property] === value; })[0];
}
// Функція проведення раунду бою між героями
function battleRound(hero1, hero2) {
    if (!hero1.isAlive || !hero2.isAlive) {
        return "\u041E\u0434\u0438\u043D \u0456\u0437 \u0433\u0435\u0440\u043E\u0457\u0432 \u0432\u0436\u0435 \u043C\u0435\u0440\u0442\u0432\u0438\u0439. \u0411\u0456\u0439 \u043D\u0435\u043C\u043E\u0436\u043B\u0438\u0432\u0438\u0439.";
    }
    // Хто атакує першим залежить від швидкості
    var firstAttacker = hero1.stats.speed >= hero2.stats.speed ? hero1 : hero2;
    var secondAttacker = firstAttacker === hero1 ? hero2 : hero1;
    // Атака першого героя
    var attack1 = calculateDamage(firstAttacker, secondAttacker);
    secondAttacker.stats.health = attack1.remainingHealth;
    secondAttacker.isAlive = secondAttacker.stats.health > 0;
    var result = "".concat(firstAttacker.name, " \u0430\u0442\u0430\u043A\u0443\u0454 ").concat(secondAttacker.name, ". \u0417\u0430\u0432\u0434\u0430\u043D\u043E ").concat(attack1.damage, " \u0448\u043A\u043E\u0434\u0438");
    if (attack1.isCritical)
        result += " (Критичний удар!)";
    result += ". \u0423 ".concat(secondAttacker.name, " \u0437\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044C ").concat(attack1.remainingHealth, " \u0437\u0434\u043E\u0440\u043E\u0432'\u044F.");
    if (!secondAttacker.isAlive) {
        result += " ".concat(secondAttacker.name, " \u0437\u0430\u0433\u0438\u043D\u0443\u0432.");
        return result;
    }
    // Атака другого героя, якщо він ще живий
    var attack2 = calculateDamage(secondAttacker, firstAttacker);
    firstAttacker.stats.health = attack2.remainingHealth;
    firstAttacker.isAlive = firstAttacker.stats.health > 0;
    result += "\n".concat(secondAttacker.name, " \u0430\u0442\u0430\u043A\u0443\u0454 ").concat(firstAttacker.name, ". \u0417\u0430\u0432\u0434\u0430\u043D\u043E ").concat(attack2.damage, " \u0448\u043A\u043E\u0434\u0438");
    if (attack2.isCritical)
        result += " (Критичний удар!)";
    result += ". \u0423 ".concat(firstAttacker.name, " \u0437\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044C ").concat(attack2.remainingHealth, " \u0437\u0434\u043E\u0440\u043E\u0432'\u044F.");
    if (!firstAttacker.isAlive) {
        result += " ".concat(firstAttacker.name, " \u0437\u0430\u0433\u0438\u043D\u0443\u0432.");
    }
    return result;
}
// Демонстрація застосування
var heroes = [
    createHero("Дмитро", HeroType.Warrior),
    createHero("Мерлін", HeroType.Mage),
    createHero("Леона", HeroType.Archer)
];
// Пошук героя за типом
var warrior = findHeroByProperty(heroes, "type", HeroType.Warrior);
console.log("Знайдений герой:", warrior);
// Проведення бою
if (heroes[0] && heroes[1]) {
    var battleLog = battleRound(heroes[0], heroes[1]);
    console.log("Результат бою:", battleLog);
}
// Вивід статистики героїв
console.log("Статистика героїв після бою:", heroes);
