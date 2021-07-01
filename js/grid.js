const CELL_SIZE = 64;
const CELL_PAD = 5;
const CELL_STEP = CELL_SIZE + CELL_PAD

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.value = -1;
        this.neighbours = [];
        this.is_to_sove = false;
        this.tmp_value = -1;
        this.tmp_neigh = [];
    }

    join(other) {
        this.neighbours.push(other);
        other.neighbours.push(this);
        // console.log('join!')
    }

    check_is_to_solve() {
        this.is_to_sove = false;
        if (this.value >= 0)
            return;
        for (let other of this.neighbours) {
            if (other.value >= 0) {
                this.is_to_sove = true;
                return
            }
        }
    }

    draw(sketch) {
        let x = this.x;
        let y = this.y;

        sketch.rect(x, y, CELL_SIZE, CELL_SIZE);
        if (this.value > 0)
            sketch.text(this.value, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        if (this.is_to_sove)
            sketch.text('?', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
    }
}

class Grid {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.cells = []
        for (let i = 0; i < this.h; i++) {
            let row = []
            this.cells[i] = row
            for (let j = 0; j < this.w; j++) {
                row[j] = new Cell(CELL_PAD + j * CELL_STEP, CELL_PAD + i * CELL_STEP);
                if (j > 0)
                    row[j - 1].join(row[j])
                if (i > 0) {
                    let prev_row = this.cells[i - 1];
                    prev_row[j].join(row[j])
                    if (j > 0)
                        prev_row[j - 1].join(row[j]);
                    if (j < w - 1)
                        prev_row[j + 1].join(row[j]);
                }
            }
        }
    }

    draw(sketch) {
        sketch.fill(180);
        sketch.stroke(0);
        sketch.textSize(32);
        sketch.textAlign('center', 'center');
        this.iter_cells().map((c) => {
            c.draw(sketch)
        }).exhaust();
    }

    xy_to_ij(x, y) {
        x -= CELL_PAD;
        y -= CELL_PAD;
        if (x < 0 || y < 0)
            return [-1, -1]
        let j = Math.floor(x / CELL_STEP);
        let i = Math.floor(y / CELL_STEP);
        if (i >= this.h || j >= this.w)
            return [-1, -1]
        return [i, j];
    }

    click(x, y, button) {
        let i;
        let j;
        [i, j] = this.xy_to_ij(x, y);
        if (i < 0)
            return;

        let cell = this.cells[i][j];
        if (button === 0) {
            if (cell.value === -1)
                cell.value++;
            cell.value++;
        } else if (cell.value > 0) {
            cell.value = -1;
        } else {
            return;
        }
        this.solve();
    }

    * iter_cells(solvable_only) {
        solvable_only ||= false;
        let cells = this.cells;
        let cell
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                cell = cells[i][j];
                if (!solvable_only || cell.is_to_sove)
                    yield cell
            }
        }
    }

    solve() {
        let self = this;

        this.iter_cells().map((cell) => {
            cell.check_is_to_solve();
            cell.tmp_value = cell.value;
        }).exhaust();

        let cells = self.iter_cells(true).array();
        for (let cell of cells) {
            cell.tmp_neigh = cell.neighbours.filter((n) => {
                return n.value >= 0
            });
        }

        function solve_wrapper(cells) {
            let solutions = [];
            let value_cells = Array.from(self.iter_cells()).filter((c) => {
                return c.value >= 0
            });
            console.log('value cells:', value_cells);
            for (let solution of solve_recur(cells)) {
                if (value_cells.every((c) => {
                    return c.tmp_value === 0
                })) {
                    console.log('solution:', value_cells, solution);
                    solutions.push(solution);
                }
            }
            return solutions;
        }

        function* solve_recur(cells) {
            console.log('recur start, cells:', cells);
            if (cells.length === 0) {
                yield [];
                return;
            }
            let first = cells[cells.length - 1];
            let rest = cells.slice(1);
            for (let partial_solution of solve_recur(rest, true)) {
                yield partial_solution.concat([0]);
                console.log('neighs:', first.tmp_neigh.map((neigh) => {
                    return neigh.tmp_value;
                }));
                if (first.tmp_neigh.every((neigh) => {
                    return neigh.tmp_value > 0;
                })) {
                    first.tmp_neigh.map((neigh) => {
                        return neigh.tmp_value -= 1;
                    });
                    yield partial_solution.concat([1]);
                    first.tmp_neigh.map((neigh) => {
                        return neigh.tmp_value += 1;
                    });
                }
            }


        }

        let solutions = solve_wrapper(cells);
        console.log(solutions);
    }
}
