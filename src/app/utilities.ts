import PriorityQueue from "priority-queue-typescript";

export interface PriorityQueueNode {
    pieces: (number | null)[][],
    moves: number,
    h: number,
}

export const searchNull = (pieces: (number | null)[][]) => {
    let nullPos = [-1, -1];
    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < pieces[i].length; j++) {
            if (pieces[i][j] === null) {
                nullPos = [i, j];
            }
        }
    }
    return nullPos;
}

export const initialPieces = [[null, 1, 2], [3, 4, 5], [6, 7, 8]];

export const shuffle = (pieces: (number | null)[][]) => {
    const shuffleMoves = Math.floor(Math.random() * 1000);
    const newPieces = JSON.parse(JSON.stringify(pieces));
    for (let i = 0; i < shuffleMoves; i++) {
        const nullPos = searchNull(newPieces);
        const movable = [];
        if (nullPos[0] !== 0) {
            movable.push([-1, 0]);
        }
        if (nullPos[0] !== newPieces.length - 1) {
            movable.push([1, 0]);
        }
        if (nullPos[1] !== 0) {
            movable.push([0, -1]);
        }
        if (nullPos[1] !== newPieces[0].length - 1) {
            movable.push([0, 1]);
        }
        const [dx, dy] = movable[Math.floor(Math.random() * movable.length)];
        newPieces[nullPos[0]][nullPos[1]] = newPieces[nullPos[0] + dx][nullPos[1] + dy];
        newPieces[nullPos[0] + dx][nullPos[1] + dy] = null;
    }
    return newPieces;
}

export const isMovable = (pieces: (number | null)[][], rowIndex: number, colIndex: number) => {
    const nullPos = searchNull(pieces);
    if (nullPos[0] === rowIndex && Math.abs(nullPos[1] - colIndex) === 1) {
        return true;
    }
    if (nullPos[1] === colIndex && Math.abs(nullPos[0] - rowIndex) === 1) {
        return true;
    }
    return false;
}

export const heuristic = (pieces: (number | null)[][]) => {
    let h = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pieces[i][j] === null) {
                continue;
            }
            const targetRow = Math.floor((pieces[i][j] ?? 0) / 3);
            const targetCol = (pieces[i][j] ?? 0) % 3;
            h += Math.abs(i - targetRow) + Math.abs(j - targetCol);
        }
    }
    return h;
}

export const minSteps = (pieces: (number | null)[][]) => {
    const visited = new Set<string>();
    const queue = new PriorityQueue<PriorityQueueNode>(
        1000000000,
        (a: PriorityQueueNode, b: PriorityQueueNode) => a.moves + a.h - b.moves - b.h
    );
    queue.add({ pieces, moves: 0, h: heuristic(pieces) });

    while (queue.size() > 0) {
        const current = queue.poll();
        if (!current) {
            break;
        }
        const key = current.pieces.map((row: (number | null)[]) => row.join('.')).join('/');

        if (visited.has(key)) {
            continue;
        }
        visited.add(key);

        if (current.h == 0) {
            return current.moves;
        }

        const nullPos = searchNull(current.pieces);
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dx, dy] of directions) {
            const x = nullPos[0] + dx;
            const y = nullPos[1] + dy;
            if (x >= 0 && x < 3 && y >= 0 && y < 3) {
                const newPieces = JSON.parse(JSON.stringify(current.pieces));
                newPieces[nullPos[0]][nullPos[1]] = newPieces[x][y];
                newPieces[x][y] = null;
                const newKey = newPieces.map((row: number[]) => row.join('')).join('/');
                if (!visited.has(newKey)) {
                    queue.add({ pieces: newPieces, moves: current.moves + 1, h: heuristic(newPieces) });
                }
            }
        }
    }

    return -1;
}

export const minStepColor = (minSteps: number) => {
    if (minSteps <= 17) {
        return 'teal';
    }
    if (minSteps <= 23) {
        return 'yellow';
    }
    if (minSteps <= 28) {
        return 'orange';
    }
    return 'red';
}
