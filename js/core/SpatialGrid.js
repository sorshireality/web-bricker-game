export class SpatialGrid {
    constructor(cellSize, width, height) {
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
        this.grid = new Map();
        this.debugMode = true;
    }

    // Convert position to grid coordinates
    getCellKey(x, y) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        return `${cellX},${cellY}`;
    }

    // Add an entity to the grid
    add(entity) {
        // For circular entities (like ball), use diameter as width/height
        const width = entity.width || (entity.radius * 2);
        const height = entity.height || (entity.radius * 2);
        
        // Get the cells this entity overlaps with
        const startX = Math.floor((entity.x - width/2) / this.cellSize);
        const startY = Math.floor((entity.y - height/2) / this.cellSize);
        const endX = Math.floor((entity.x + width/2) / this.cellSize);
        const endY = Math.floor((entity.y + height/2) / this.cellSize);

        // Add entity to all overlapping cells
        for (let cellX = startX; cellX <= endX; cellX++) {
            for (let cellY = startY; cellY <= endY; cellY++) {
                const key = `${cellX},${cellY}`;
                if (!this.grid.has(key)) {
                    this.grid.set(key, new Set());
                }
                this.grid.get(key).add(entity);
            }
        }
    }

    // Remove an entity from the grid
    remove(entity) {
        // For circular entities (like ball), use diameter as width/height
        const width = entity.width || (entity.radius * 2);
        const height = entity.height || (entity.radius * 2);
        
        const startX = Math.floor((entity.x - width/2) / this.cellSize);
        const startY = Math.floor((entity.y - height/2) / this.cellSize);
        const endX = Math.floor((entity.x + width/2) / this.cellSize);
        const endY = Math.floor((entity.y + height/2) / this.cellSize);

        for (let cellX = startX; cellX <= endX; cellX++) {
            for (let cellY = startY; cellY <= endY; cellY++) {
                const key = `${cellX},${cellY}`;
                if (this.grid.has(key)) {
                    this.grid.get(key).delete(entity);
                }
            }
        }
    }

    // Get potential collision candidates for an entity
    getCollisionCandidates(entity) {
        // For circular entities (like ball), use diameter as width/height
        const width = entity.width || (entity.radius * 2);
        const height = entity.height || (entity.radius * 2);
        
        const candidates = new Set();
        
        const startX = Math.floor((entity.x - width/2) / this.cellSize);
        const startY = Math.floor((entity.y - height/2) / this.cellSize);
        const endX = Math.floor((entity.x + width/2) / this.cellSize);
        const endY = Math.floor((entity.y + height/2) / this.cellSize);

        for (let cellX = startX; cellX <= endX; cellX++) {
            for (let cellY = startY; cellY <= endY; cellY++) {
                const key = `${cellX},${cellY}`;
                if (this.grid.has(key)) {
                    this.grid.get(key).forEach(candidate => {
                        if (candidate !== entity) {
                            candidates.add(candidate);
                        }
                    });
                }
            }
        }

        return Array.from(candidates);
    }

    // Clear the grid
    clear() {
        this.grid.clear();
    }

    // Toggle debug mode
    toggleDebug() {
        this.debugMode = !this.debugMode;
    }

    // Draw debug visualization
    drawDebug(ctx) {
        if (!this.debugMode) return;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        // Vertical lines
        for (let x = 0; x <= this.width; x += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.height; y += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Draw occupied cells
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        for (const [key, entities] of this.grid.entries()) {
            if (entities.size > 0) {
                const [cellX, cellY] = key.split(',').map(Number);
                ctx.fillRect(
                    cellX * this.cellSize,
                    cellY * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );

                // Draw entity count
                ctx.fillStyle = 'white';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    entities.size.toString(),
                    cellX * this.cellSize + this.cellSize / 2,
                    cellY * this.cellSize + this.cellSize / 2
                );
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            }
        }

        // Draw entity bounds
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.lineWidth = 2;
        for (const entities of this.grid.values()) {
            for (const entity of entities) {
                ctx.strokeRect(
                    entity.x,
                    entity.y,
                    entity.width || entity.radius * 2,
                    entity.height || entity.radius * 2
                );
            }
        }
    }
} 