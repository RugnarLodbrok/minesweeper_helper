class Grid {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.cells = []
        this._is_drawn = false;

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
        if (this._is_drawn)
            return
        this._is_drawn = true;
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
        let cells;
        let value_cells;

        function prepare() {
            // preparation
            self.iter_cells().map((cell) => cell.check_is_to_solve());
            cells = self.iter_cells(true).array();
            value_cells = self.iter_cells().array().filter((c) => (c.value >= 0));

        }
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
                yield [0].concat(partial_solution);
                if (first.tmp_neigh.every((cell) => cell.tmp_value > 0)) {
                    first.tmp_neigh.map((cell) => cell.tmp_value -= 1);
                    yield [1].concat(partial_solution);
                    first.tmp_neigh.map((cell) => cell.tmp_value += 1);
                }
            }
        }

        function solution_post_process(solutions){
            let n_solutions = solutions.length;

            self.has_solution = !!n_solutions;
            if (!n_solutions)
                return

            let odds = zip(...solutions).map((cell_vals) => cell_vals.reduce(add) / n_solutions);
            console.log(odds);

            cells.map((cell, i) => {
                cell.odds = odds[i];
            });
        }
        prepare();
        solution_post_process(solve_wrapper(cells));
        this._is_drawn = false;
    }
}
