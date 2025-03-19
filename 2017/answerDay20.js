const fs = require('fs');

// Function to parse particle data from a text file
function parseParticles(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return data.trim().split('\n').map(line => {
        const match = line.match(/p=<([^>]+)>, v=<([^>]+)>, a=<([^>]+)>/);
        if (match) {
            return {
                position: match[1].split(',').map(Number),
                velocity: match[2].split(',').map(Number),
                acceleration: match[3].split(',').map(Number)
            };
        }
        return null;
    });
}

// Function to calculate the Manhattan distance from the origin
function manhattanDistance(position) {
    return Math.abs(position[0]) + Math.abs(position[1]) + Math.abs(position[2]);
}

// Part 1: Find the particle that stays closest to <0,0,0> in the long term
function findClosestParticle(particles) {
    let closestParticle = -1;
    let smallestAcceleration = Infinity;

    particles.forEach((particle, index) => {
        const accelerationMagnitude = manhattanDistance(particle.acceleration);

        // In the long term, acceleration dominates distance calculations
        if (accelerationMagnitude < smallestAcceleration) {
            smallestAcceleration = accelerationMagnitude;
            closestParticle = index;
        } else if (accelerationMagnitude === smallestAcceleration) {
            const velocityMagnitude = manhattanDistance(particle.velocity);
            const positionMagnitude = manhattanDistance(particle.position);

            // Break ties by velocity, then by initial position
            if (velocityMagnitude < manhattanDistance(particles[closestParticle].velocity) ||
                (velocityMagnitude === manhattanDistance(particles[closestParticle].velocity) &&
                 positionMagnitude < manhattanDistance(particles[closestParticle].position))) {
                closestParticle = index;
            }
        }
    });

    return closestParticle;
}

// Part 2: Resolve collisions and determine remaining particles
function resolveCollisions(particles) {
    for (let t = 0; t < 1000; t++) { // Run for a sufficiently large number of ticks
        const positions = new Map();

        // Update each particle
        particles.forEach((particle, index) => {
            // Update velocity
            particle.velocity[0] += particle.acceleration[0];
            particle.velocity[1] += particle.acceleration[1];
            particle.velocity[2] += particle.acceleration[2];

            // Update position
            particle.position[0] += particle.velocity[0];
            particle.position[1] += particle.velocity[1];
            particle.position[2] += particle.velocity[2];

            // Track positions
            const positionKey = particle.position.join(',');
            if (!positions.has(positionKey)) {
                positions.set(positionKey, []);
            }
            positions.get(positionKey).push(index);
        });

        // Remove particles that collide
        const collisions = Array.from(positions.values()).filter(indices => indices.length > 1);
        collisions.forEach(indices => {
            indices.forEach(index => {
                particles[index] = null; // Mark particle as removed
            });
        });

        // Filter out null particles
        particles = particles.filter(particle => particle !== null);
    }

    return particles.length; // Return the number of remaining particles
}

// Main function
function main() {
    const filename = 'inputDay20.txt'; // Replace with your input file name
    const particles = parseParticles(filename);

    // Part 1: Find the particle that stays closest to <0,0,0> in the long term
    const closestParticle = findClosestParticle(particles);
    console.log(`The particle that stays closest to <0,0,0> in the long term is: ${closestParticle}`);

    // Part 2: Resolve collisions and determine remaining particles
    const remainingParticles = resolveCollisions(particles);
    console.log(`The number of particles remaining after all collisions is: ${remainingParticles}`);
}

// Execute the main function
main();
