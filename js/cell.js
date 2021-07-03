const CELL_SIZE = 64;
const CELL_PAD = 5;
const CELL_STEP = CELL_SIZE + CELL_PAD

const CELL_CLOSED = -1
const CELL_MONSTER = -2

class Cell {
    constructor(i, j) {
        this.i = i;
        this.j = j

        this.x = CELL_PAD + j * CELL_STEP;
        this.y = CELL_PAD + i * CELL_STEP;

        this.value = -1;
        this.neighbours = [];
        this.is_to_sove = false;
        this.tmp_value = -1;
        this.tmp_neigh = [];
        this.is_red = false;
        this.is_green = false;
    }

    value_neighbours() {
        return this.neighbours.filter((n) => n.value >= 0);
    }

    ij() {
        return this.i + '-' + this.j;
    }

    join(other) {
        this.neighbours.push(other);
        other.neighbours.push(this);
    }

    check_is_to_solve() {
        //prepare cell to solve
        this.is_red = false;
        this.is_green = false;
        this.is_to_sove = false;
        this.tmp_value = this.value - this.neighbours.filter((c) => c.value === CELL_MONSTER).length;
        if (this.value !== CELL_CLOSED)
            return;
        for (let other of this.neighbours) {
            if (other.value >= 0) {
                this.is_to_sove = true;
                this.tmp_neigh = this.value_neighbours();
                return
            }
        }
    }

    draw(sketch) {
        let x = this.x;
        let y = this.y;
        let [cx, cy] = [x + CELL_SIZE / 2, y + CELL_SIZE / 2]

        sketch.fill(180);
        sketch.stroke(0);
        sketch.textSize(32);
        sketch.textAlign('center', 'center');
        sketch.rect(x, y, CELL_SIZE, CELL_SIZE);

        if (this.value === CELL_MONSTER) {
            sketch.fill(255, 0, 0);
            sketch.circle(cx, cy, 24);
            return;
        }
        if (this.value >= 0)
            sketch.text(this.value, cx, cy);
        if (this.is_red) {
            sketch.fill(255, 0, 0);
            sketch.circle(cx, cy, 5);
        } else if (this.is_green) {
            sketch.fill(0, 255, 0)
            sketch.circle(cx, cy, 5)
        } else if (this.is_to_sove)
            sketch.text('?', x + CELL_SIZE / 2, y + CELL_SIZE / 2);

    }
}
