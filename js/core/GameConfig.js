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
        width: 42,
        height: 21,
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
        baseSpeed: 30,
        maxSpeed: 15,
        acceleration: 0.2,
        friction: 0.99,
        spinFactor: 0.5,
        powerShot: {
            enabled: true,
            speedMultiplier: 1.5,  // 50% speed increase
            duration: 1000,        // 1 second duration
            cooldown: 2000,        // 2 seconds cooldown
            hitThreshold: 0.8      // Must hit within 80% of paddle center for power shot
        }
    },
    boosterConfig: {
        width: 20,
        height: 20,
        speed: 2,
        dropChance: {
            glass: 0.25  // 25% chance to drop splitter from glass bricks
        },
        effects: {
            splitter: {
                duration: 0,  // Permanent effect
                icon: '🎯',
                speedMultiplier: 0.8,  // New balls will have 80% of original speed
                spreadAngle: Math.PI/4  // 45 degrees spread angle
            },
            fire: {
                duration: 10000,  // 10 seconds duration
                icon: '🔥'
            }
        }
    },
    collisionConfig: {
        cellSize: 64, // Size of each grid cell for spatial partitioning
    },
}; 