interface T {
    pieces: (number | null)[][],
    moves: number,
    h: number
}

export class PriorityQueue {
    private queue = new Array<T>();

    public push(v: T) {
        this.queue.push(v);
        const back = this.queue.length - 1;

        this.against(back);
    }

    private against(childIdx: number) {
        const parentIdx = Math.ceil(childIdx / 2) - 1;

        const childHeuristic = this.queue[childIdx].h;
        const parentHeuristic = this.queue[parentIdx].h;

        if (parentHeuristic > childHeuristic) {
            this.swap(childIdx, parentIdx);
            this.against(parentIdx);
        }
    }

    private swap(a: number, b: number) {
        const tmp = this.queue[a];
        this.queue[a] = this.queue[b];
        this.queue[b] = tmp;
    }

    public top(): T {
        if (this.queue.length === 0) throw new Error("empty");
        return this.queue[0];
    }

    public pop(): T {
        if (this.queue.length === 0) throw new Error("empty");
        const ans = this.top();
        const tail = this.queue.pop();
        if (this.size() > 0) {
            if (tail !== undefined) {
                this.queue[0] = tail;
            }
            this.flow(0);
        }
        this.flow(0);
        return ans;
    }

    private flow(parent: number) {
        const parentHeuristic = this.queue[parent].h;

        const left = parent * 2 + 1;
        const right = parent * 2 + 2;

        if (!this.inRange(left)) return;

        if (this.inRange(left) && !this.inRange(right)) {
            const leftHeuristic = this.queue[left].h;

            if (parentHeuristic > leftHeuristic) {
                this.swap(parent, left);
            }
        }

        if (this.inRange(left) && this.inRange(right)) {
            const leftHeuristic = this.queue[left].h;
            const rightHeuristic = this.queue[right].h;
            const target = leftHeuristic < rightHeuristic ? left : right;
            const targetHeuristic = this.queue[target].h;

            if (parentHeuristic < targetHeuristic) {
                this.swap(parent, target);
                this.flow(target);
            }
        }
    }

    private inRange(index: number): boolean {
        return index < this.queue.length;
    }

    public size() {
        return this.queue.length;
    }
}
