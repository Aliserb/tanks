import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

/**
 * Бот Алишер
 */
export class AlisherBot extends Bot {
    constructor() {
        super();
        this._fire = false;
        this.randomStep = 0;
        this.randomFire = 0;
        this.name = 'Алишер';
        this.stepCount = 0;
    }

    /**
     * Возвращает ближайшего противника
     * @param {Object} myPosition {x, y} - текущая позиция
     * @param {Array} enemies - массив противников {x, y}
     * @returns {Object|null} ближайший противник или null, если противников нет
     */
    getNearestEnemy(myPosition, enemies) {
        if (enemies.length === 0) {
            console.warn('No enemies available');
            return null; // Возвращаем null, если нет противников
        }

        return enemies.reduce((nearest, enemy) => {
            const distanceToEnemy = this.calculateDistance(myPosition, enemy);
            const distanceToNearest = this.calculateDistance(myPosition, nearest);
            return distanceToEnemy < distanceToNearest ? enemy : nearest;
        });
    }

    /**
     * Вычисляет расстояние между двумя точками
     * @param {Object} a {x, y} - первая точка
     * @param {Object} b {x, y} - вторая точка
     * @returns {number} расстояние между точками
     * @throws {Error} если данные некорректны
     */
    calculateDistance(a, b) {
        if (!a || typeof a.x !== 'number' || typeof a.y !== 'number') {
            return null; // Возвращаем null
        }
        if (!b || typeof b.x !== 'number' || typeof b.y !== 'number') {
            return null; // Возвращаем null
        }

        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }


    /**
     * Двигаемся к указанной позиции
     * @param {Object} target {x, y} - целевая позиция
     * @param {Object} myPosition {x, y} - моя позиция
     */
    moveTowards(target, myPosition) {
        console.log('Target Position:', target);
        console.log('My Position:', myPosition);

        // Вычисляем разницу между текущей позицией и целью
        const deltaX = target.x - myPosition.x;
        const deltaY = target.y - myPosition.y;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // Движение вверх или вниз
            if (deltaY > 0 && this.canIDoMoveAction(ACTIONS.down)) {
                this.down();
            } else if (deltaY < 0 && this.canIDoMoveAction(ACTIONS.up)) {
                this.up();
            } else if (deltaX > 0 && this.canIDoMoveAction(ACTIONS.right)) {
                this.right();
            } else if (deltaX < 0 && this.canIDoMoveAction(ACTIONS.left)) {
                this.left();
            }
        } else {
            // Движение вправо или влево
            if (deltaX > 0 && this.canIDoMoveAction(ACTIONS.right)) {
                this.right();
            } else if (deltaX < 0 && this.canIDoMoveAction(ACTIONS.left)) {
                this.left();
            } else if (deltaY > 0 && this.canIDoMoveAction(ACTIONS.down)) {
                this.down();
            } else if (deltaY < 0 && this.canIDoMoveAction(ACTIONS.up)) {
                this.up();
            }
        }
    }



    doStep() {
        const myPosition = this.myPosition; // Узнаем свою позицию
        const enemies = this.enemies; // Узнаем положение всех противников

        if (enemies.length <= 0) { // уходим в спячку если нет противников
            this.sleep()
        }

        // Получаем ближайшего противника
        const nearestEnemy = this.getNearestEnemy(myPosition, enemies);

        if (this.calculateDistance(myPosition, nearestEnemy) <= 3) {

            if (myPosition && nearestEnemy) {
                if (myPosition.x === nearestEnemy.x) {
                    if (myPosition.y > nearestEnemy.y) {
                        this.fire(ACTIONS.up);
                    } else {
                        this.fire(ACTIONS.down);
                    }
                }
    
                if (myPosition.y === nearestEnemy.y) {
                    if (myPosition.x > nearestEnemy.x) {
                        this.fire(ACTIONS.left);
                    } else {
                        this.fire(ACTIONS.right);
                    }
                }
            }
            
        } else {
            this.moveTowards(nearestEnemy, myPosition);
        }
        
    }
}

