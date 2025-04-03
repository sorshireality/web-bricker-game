export class CollisionDetector {

    /**
     * Checks for and handles collision between the ball and the paddle.
     * Modifies the ball's velocity and position upon collision.
     * @param {Ball} ball - The ball object.
     * @param {Paddle} paddle - The paddle object.
     */
    static checkPaddle(ball, paddle) {
        if (!ball || !paddle) return; // Ensure objects exist

        // Check if ball is moving down AND is potentially hitting the paddle's top surface
        if (ball.dy > 0 && // Ball moving downwards
            ball.y + ball.radius >= paddle.y && // Ball's bottom edge is at or below paddle's top edge
            ball.y - ball.radius <= paddle.y + paddle.height && // Ball's top edge is above paddle's bottom edge
            ball.x + ball.radius >= paddle.x && // Ball's right edge is right of paddle's left edge
            ball.x - ball.radius <= paddle.x + paddle.width) // Ball's left edge is left of paddle's right edge
        {
            console.log("Paddle Hit! (Detected by CollisionDetector)"); // Updated log

            // Reverse vertical direction
            ball.dy = -ball.dy;

            // Optional: Adjust horizontal speed based on where it hit the paddle
            // let collidePoint = ball.x - (paddle.x + paddle.width / 2);
            // ball.dx = collidePoint * 0.1; // Adjust multiplier for desired effect

            // Move ball slightly above paddle to prevent sticking in the next frame
            ball.y = paddle.y - ball.radius;
        }
    }

    /**
     * Checks for and handles collision between the ball and bricks.
     * Modifies the ball's velocity and potentially removes bricks.
     * @param {Ball} ball - The ball object.
     * @param {Array<AbstractBrick>} bricks - The array of brick objects.
     * @returns {Array<AbstractBrick>} The potentially modified array of bricks (e.g., after removing hit bricks).
     */
    static checkBricks(ball, bricks) {
        if (!ball || !bricks || bricks.length === 0) return bricks; // Nothing to check

        let remainingBricks = bricks; // Start with the current bricks

        // TODO: Implement brick collision logic here
        // - Loop through each brick in 'remainingBricks'
        // - Perform AABB check between ball and brick
        // - If collision:
        //    - Determine collision side (top/bottom/left/right) to reverse correct velocity (dx or dy)
        //    - Call brick.hit()
        //    - Potentially add score
        //    - Break the loop if you only want one brick hit per frame (common)
        // - After the loop, filter out destroyed bricks:
        //   remainingBricks = remainingBricks.filter(brick => !brick.isDestroyed());

        console.warn("CollisionDetector.checkBricks() not implemented yet."); // Placeholder

        return remainingBricks; // Return the list (potentially filtered)
    }
    /**
     * Checks for and handles collision between the ball and bricks.
     * Modifies the ball's velocity and calls hit() on the brick.
     * Filters out destroyed bricks.
     * @param {Ball} ball - The ball object.
     * @param {Array<AbstractBrick>} bricks - The array of brick objects.
     * @returns {Array<AbstractBrick>} The filtered array of bricks (only non-destroyed ones).
     */
    static checkBricks(ball, bricks) {
        if (!ball || !bricks || bricks.length === 0) return bricks;

        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (!brick || brick.isDestroyed()) continue; // Skip if brick doesn't exist or already destroyed

            // --- AABB Collision Check ---
            const ballLeft = ball.x - ball.radius;
            const ballRight = ball.x + ball.radius;
            const ballTop = ball.y - ball.radius;
            const ballBottom = ball.y + ball.radius;

            const brickLeft = brick.x;
            const brickRight = brick.x + brick.width;
            const brickTop = brick.y;
            const brickBottom = brick.y + brick.height;

            // Check for overlap
            if (ballRight > brickLeft &&
                ballLeft < brickRight &&
                ballBottom > brickTop &&
                ballTop < brickBottom)
            {
                // --- Collision Detected ---
                console.log("Brick Hit!"); // Debug log
                brick.hit(); // Reduce brick health

                // --- Determine Bounce Direction (Simple Approach) ---
                // A common simple way is to reverse vertical velocity.
                // More complex logic could check which side was hit.
                // Let's find the overlap amounts to guess the side.
                const overlapLeft = ballRight - brickLeft;
                const overlapRight = brickRight - ballLeft;
                const overlapTop = ballBottom - brickTop;
                const overlapBottom = brickBottom - ballTop;

                // Find the minimum overlap (indicates the side of penetration)
                const minOverlapX = Math.min(overlapLeft, overlapRight);
                const minOverlapY = Math.min(overlapTop, overlapBottom);

                // If horizontal overlap is smaller, it's a side hit
                if (minOverlapX < minOverlapY) {
                    ball.dx = -ball.dx; // Reverse horizontal direction
                    // Adjust position slightly to prevent sticking
                    ball.x += (overlapLeft < overlapRight ? -overlapLeft : overlapRight) / 2 * (ball.dx > 0 ? 1 : -1);

                } else { // Otherwise, it's a top/bottom hit
                    ball.dy = -ball.dy; // Reverse vertical direction
                    // Adjust position slightly
                    ball.y += (overlapTop < overlapBottom ? -overlapTop : overlapBottom) / 2 * (ball.dy > 0 ? 1 : -1);
                }


                // --- Optional: Add Score ---
                // score += 10; // Assuming 'score' is a global or accessible variable

                // --- Important: Break after first hit per frame ---
                // Prevents hitting multiple bricks simultaneously in one physics step
                break;
            }
        }

        // --- Filter out destroyed bricks ---
        // Return a new array containing only the bricks that are NOT destroyed
        return bricks.filter(brick => !brick.isDestroyed());
    }

    // Add other collision checks here later (e.g., ball vs walls if needed differently than boundary checks)
}
