export const GameConfig = {
    levels: [
        {
            number: 1,
            ballSpeed: 6,
            brickDistribution: { glass: 0.9, wood: 0.1 },
            brickRows: 3,
            brickColumns: 6
        },
        {
            number: 2,
            ballSpeed: 6.5,
            brickDistribution: { glass: 0.75, wood: 0.25 },
            brickRows: 4,
            brickColumns: 7
        },
        {
            number: 3,
            ballSpeed: 7,
            brickDistribution: { glass: 0.6, wood: 0.4 },
            brickRows: 5,
            brickColumns: 8
        },
        {
            number: 4,
            ballSpeed: 7.5,
            brickDistribution: { glass: 0.4, wood: 0.6 },
            brickRows: 6,
            brickColumns: 9
        },
        {
            number: 5,
            ballSpeed: 8,
            brickDistribution: { glass: 0.25, wood: 0.75 },
            brickRows: 7,
            brickColumns: 10
        }
    ],
    brickConfig: {
        width: 48,
        height: 20,
        padding: 5,
        offsetTop: 30
    },
    paddleConfig: {
        width: 100,
        height: 20,
        speed: 7,
        maxSpeed: 15,
        acceleration: 0.5,
        friction: 0.95
    },
    ballConfig: {
        radius: 10,
        baseSpeed: 50,
        maxSpeed: 15,
        acceleration: 0.2,
        friction: 0.99,
        spinFactor: 0.5
    },
    boosterConfig: {
        width: 20,
        height: 20,
        speed: 2,
        dropChance: {
            wood: 0.3,  // 30% chance to drop splitter from wood bricks
            glass: 0.2  // 20% chance to drop fire booster from glass bricks
        },
        effects: {
            splitter: {
                duration: 0,  // Permanent effect
                icon: '🎯'
            },
            fire: {
                duration: 5000,  // 5 seconds
                damageMultiplier: 2,
                icon: '🔥'
            }
        }
    },
    collisionConfig: {
        cellSize: 64, // Size of each grid cell for spatial partitioning
    },
}; 