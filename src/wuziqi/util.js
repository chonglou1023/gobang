export function calculateWinner(squares, pos) {
    const [i, j] = pos;
    let x = i, y = j;
    let area = [[i, j]]
    // 竖向判断
    while (x > 0 && squares[--x][y] === squares[i][j]) {
        area.push([x, y]);
    };

    x = i
    while (x < squares.length - 1 && squares[++x][y] === squares[i][j]) {
        area.push([x, y]);
    }
    if (area.length >= 5)
        return area;
    area = [[i, j]]
    x = i;
    y = j;
    // 横向判断
    while (y > 0 && squares[i][--y] === squares[i][j]) {
        area.push([x, y]);
    }
    y = j
    while (y < squares.length - 1 && squares[i][++y] === squares[i][j]) {
        area.push([x, y]);
    }
    if (area.length >= 5)
        return area;
    area = [[i, j]]
    x = i;
    y = j;
    // 左上到右下
    while (x > 0 && y > 0 && squares[--x][--y] === squares[i][j]) {
        area.push([x, y]);
    }
    x = i
    y = j
    while (x < squares.length - 1 && y < squares.length - 1 && squares[++x][++y] === squares[i][j]) {
        area.push([x, y]);
    }
    if (area.length >= 5)
        return area;
    area = [[i, j]]
    x = i;
    y = j;
    // 右上到左下
    while (x > 0 && y < squares.length - 1 && squares[--x][++y] === squares[i][j]) {
        area.push([x, y]);
    }
    x = i
    y = j
    while (x < squares.length - 1 && y > 0 && squares[++x][--y] === squares[i][j]) {
        area.push([x, y]);
    }
    if (area.length >= 5)
        return area;
    return null;
}