let grid;

function p5_func(sketch) {
    sketch.setup = () => {
        grid = new Grid(8, 6);
        sketch.createCanvas(grid.w * CELL_STEP + CELL_PAD, grid.h * CELL_STEP + CELL_PAD);
    };
    sketch.draw = () => {


        grid.draw(sketch);
    };
    sketch.mouseClicked = (e) => {
        let x = e.clientX;
        let y = e.clientY;
        grid.click(x, y, 0);
        return false;
    }
    document.oncontextmenu = (e) => {
        e.preventDefault();
        let x = e.clientX;
        let y = e.clientY;
        grid.click(x, y, 1);
        return false;
    }

}

new p5(p5_func, document.getElementById("sketch"));
