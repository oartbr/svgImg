// Import the component classes
import Square from './components/Square.js';
import Circle from './components/Circle.js';
import Polygon from './components/Polygon.js';
import Star from './components/Star.js';

// Import the transformer classes
import Noise from './transformers/Noise.js';
import Waves from './transformers/Waves.js';
import Flip from './transformers/Flip.js';
import Rotate from './transformers/Rotate.js';

// Import the generator classes
import ComplexPathGenerator from './generators/ComplexPathGenerator.js';
import CollectionGenerator from './generators/CollectionGenerator.js';

// Define the library object
const SVIM = {
    components: {
        Square,
        Circle,
        Polygon,
        Star,
        // Add more component classes here
    },
    transformers: {
        Noise,
        Waves,
        Flip,
        Rotate,
        // Add more transformer classes here
    },
    generators: {
        ComplexPathGenerator,
        CollectionGenerator,
        // Add more generator classes here
    },
};

// Export the library object
export default SVIM;
