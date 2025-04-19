export class SpatialGrid {
    constructor(cellSize, width, height) {
        this.cellSize = cellSize;
        this.width = width;
        this.height = height;
        this.grid = new Map();
        this.debugMode = false;
        
        // Calculate number of cells
        this.cellsX = Math.ceil(width / cellSize);
        this.cellsY = Math.ceil(height / cellSize);
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
        const startX = Math.max(0, Math.floor((entity.x - width/2) / this.cellSize));
        const startY = Math.max(0, Math.floor((entity.y - height/2) / this.cellSize));
        const endX = Math.min(this.cellsX - 1, Math.floor((entity.x + width/2) / this.cellSize));
        const endY = Math.min(this.cellsY - 1, Math.floor((entity.y + height/2) / this.cellSize));

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
        
        const startX = Math.max(0, Math.floor((entity.x - width/2) / this.cellSize));
        const startY = Math.max(0, Math.floor((entity.y - height/2) / this.cellSize));
        const endX = Math.min(this.cellsX - 1, Math.floor((entity.x + width/2) / this.cellSize));
        const endY = Math.min(this.cellsY - 1, Math.floor((entity.y + height/2) / this.cellSize));

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
        
        const startX = Math.max(0, Math.floor((entity.x - width/2) / this.cellSize));
        const startY = Math.max(0, Math.floor((entity.y - height/2) / this.cellSize));
        const endX = Math.min(this.cellsX - 1, Math.floor((entity.x + width/2) / this.cellSize));
        const endY = Math.min(this.cellsY - 1, Math.floor((entity.y + height/2) / this.cellSize));

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
        
        // When disabling debug mode, also disable entity-specific debug visualizations
        if (!this.debugMode) {
            for (const entities of this.grid.values()) {
                for (const entity of entities) {
                    if (entity.debugCollision !== undefined) {
                        entity.debugCollision = false;
                    }
                }
            }
        }
    }

    // Draw debug visualization
    drawDebug(ctx) {
        if (!this.debugMode) return;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;

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
        for (const [key, entities] of this.grid.entries()) {
            if (entities.size > 0) {
                const [cellX, cellY] = key.split(',').map(Number);
                
                // Draw cell background with opacity based on object count
                const opacity = Math.min(0.3, 0.1 + (entities.size * 0.05));
                ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
                ctx.fillRect(
                    cellX * this.cellSize,
                    cellY * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );

                // Draw entity count
                ctx.fillStyle = 'white';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(
                    entities.size.toString(),
                    cellX * this.cellSize + this.cellSize / 2,
                    cellY * this.cellSize + this.cellSize / 2
                );
            }
        }

        // Draw entity bounds
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        for (const entities of this.grid.values()) {
            for (const entity of entities) {
                // Enable each entity's debug visualization if it has one
                if (entity.debugCollision !== undefined) {
                    entity.debugCollision = true;
                } else {
                    // For entities without a custom debug visualization
                    if (entity.radius) {
                        // For circular entities (like balls)
                        ctx.beginPath();
                        ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
                        ctx.stroke();
                    } else {
                        // For rectangular entities (like bricks and paddle)
                        ctx.strokeRect(
                            entity.x,
                            entity.y,
                            entity.width,
                            entity.height
                        );
                    }
                }
            }
        }
    }
} 