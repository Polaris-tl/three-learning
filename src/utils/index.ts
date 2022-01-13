import * as dat from 'dat.gui';

const gui = new dat.GUI();

class Options {
    distance = 5;
    x = -16;
    y = 21;
    z = 8;
}

const options = new Options();

gui.add(options, 'distance', 0, 20);
gui.add(options, 'x', -100, 100);
gui.add(options, 'y', -100, 100);
gui.add(options, 'z', -100, 100);

export default options