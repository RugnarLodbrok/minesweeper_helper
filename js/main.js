let grid;

function p5_func(sketch) {
    sketch.setup = () => {
        sketch.createCanvas(800, 600);
        grid = new Grid(2, 3);
    };
    sketch.draw = () => {

        sketch.background(220);


        grid.draw(sketch);
    };
    sketch.mouseClicked = (e) => {
        let x = e.clientX;
        let y = e.clientY;
        grid.click(x, y, 0);
        return false;
    }
    document.oncontextmenu = (e)=>{
        e.preventDefault();
        let x = e.clientX;
        let y = e.clientY;
        grid.click(x, y, 1);
        return false;
    }

}

new p5(p5_func, document.getElementById("sketch"));
// document.oncontextmenu = (e)=>{
//     console.log('right click', e);
//     e.preventDefault();
// }
