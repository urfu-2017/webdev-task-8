import GameLoop from './lib/gameLoop';
import View from './view';


const surface = document.querySelector('.view');
const game = new GameLoop(() => new View(surface));
game.run();
