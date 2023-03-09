

export interface Point {
    x: number;
    y: number;
}

export interface Line {
    points: Point[];
    visiblePoints?: Point[];
    visibleMinXIndex?: number;
    visibleMaxXIndex?: number;
    color?: string;
}

export function calculteVisiblePointsLoopAll(line: Line, xMin: number, xMax: number) {
    line.visiblePoints = [];
    let isInBlock = false;
    let prevIsInBlock = false;
    for (let i = 0; i < line.points.length; i++) {
        isInBlock = false;
        if (line.points[i].x >= xMin && line.points[i].x <= xMax) {
            isInBlock = true;
            line.visiblePoints.push(line.points[i]);
        }

        if (isInBlock && !prevIsInBlock) {
            line.visibleMinXIndex = i;
        }

        if (!isInBlock && prevIsInBlock) {
            line.visibleMaxXIndex = i;
        }

        prevIsInBlock = isInBlock;
    }

    if (line.visibleMinXIndex === undefined) {
        line.visibleMinXIndex = 0;
    }

    if (line.visibleMaxXIndex === undefined) {
        line.visibleMaxXIndex = line.points.length - 1;
    }
}

export function calculteVisiblePoints(line: Line, previousPan: { x: number, y: number }, pan: { x: number, y: number }, scale: number, width: number, height: number) {
    if (!line.visiblePoints || !line.visibleMaxXIndex || !line.visibleMinXIndex) {
        calculteVisiblePointsLoopAll(line, line.points[0].x, line.points[line.points.length - 1].x);
        return;
    }

    let panDir = Math.sign(pan.x - previousPan.x);
    console.log('panDir', panDir);
    

    let newMinX = line.visibleMinXIndex;
    let newMaxX = line.visibleMaxXIndex;


    if (panDir === 1) {
        let i = line.visibleMaxXIndex;
        while (i < line.points.length) {
            if (line.points[i].x > line.points[line.visibleMaxXIndex].x + width / scale) {
                newMaxX = i;
                break;
            }
            i++;
        }
    } else if (panDir === -1) {
        let i = line.visibleMinXIndex;
        while (i >= 0) {
            if (line.points[i].x < line.points[line.visibleMinXIndex].x - width / scale) {
                newMinX = i;
                break;
            }
            i--;
        }
    } else {
        return;
    }

    line.visibleMinXIndex = newMinX;
    line.visibleMaxXIndex = newMaxX;

    console.assert(newMinX >= 0 && newMinX < line.points.length, 'newMinX is out of bounds');
    console.assert(newMaxX >= 0 && newMaxX < line.points.length, 'newMaxX is out of bounds');
    console.assert(newMinX <= newMaxX, 'newMinX is greater than newMaxX');

    line.visiblePoints = [];
    for (let i = line.visibleMinXIndex; i < line.visibleMaxXIndex; i++) {
        line.visiblePoints.push(line.points[i]);
    }
}