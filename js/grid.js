class Grid {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.cells = []

        this.has_solution = true;
        for (let i = 0; i < this.h; i++) {
            let row = []
            this.cells[i] = row
            for (let j = 0; j < this.w; j++) {
                row[j] = new Cell(i, j);
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
        if (this.has_solution)
            sketch.background(220);
        else
            sketch.background(220, 150, 150);
        this.iter_cells().map((c) => c.draw(sketch))
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
            cell.value++;
        } else if (cell.value !== CELL_MONSTER) {
            cell.value--;
        } else
            cell.value = CELL_CLOSED;
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

        // preparation
        this.iter_cells().map((cell) => cell.check_is_to_solve());
        let cells = self.iter_cells(true).array();
        let value_cells = self.iter_cells().array().filter((c) => (c.value >= 0));

        function solve_wrapper(cells) {
            let solutions = [];
            for (let solution of solve_recur(cells)) {
                let viable = value_cells.every((c) => c.tmp_value === 0);
                if (viable) {
                    solutions.push(solution);
                }
            }
            return solutions;
        }

        function* solve_recur(cells) {
            if (cells.length === 0) {
                yield [];
                return;
            }
            let first = cells[0];
            let rest = cells.slice(1);
            for (let partial_solution of solve_recur(rest, true)) {
                let res = [0].concat(partial_solution);
                yield res;
                if (first.tmp_neigh.every((neigh) => neigh.tmp_value > 0)) {
                    first.tmp_neigh.map((neigh) => neigh.tmp_value -= 1);
                    let res = [1].concat(partial_solution);
                    yield res;
                    first.tmp_neigh.map((neigh) => neigh.tmp_value += 1);
                }
            }


        }

        let solutions = solve_wrapper(cells);
        this.has_solution = !!solutions.length;
        if (!solutions.length)
            return
        cells.map((cell, i) => {
            if (solutions.every((s) => s[i] === 0))
                cell.is_green = true;
            if (solutions.every((s) => s[i] === 1))
                cell.is_red = true;
        });
    }
}
