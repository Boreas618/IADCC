function computeAngle(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}


function interpolatePoint(pointA, pointB, alpha) {
    return [
        (1 - alpha) * pointA['positionX'] + alpha * pointB['positionX'],
        (1 - alpha) * pointA['positionY'] + alpha * pointB['positionY']
    ];
}

function interpolateTrajectory(trajectory, targetLength) {
    const interpolated = [];
    const n = trajectory.length;
    for (let i = 0; i < targetLength - 1; i++) {
        const pos = i * (n - 1) / (targetLength - 1);
        const idx = Math.floor(pos);
        const alpha = pos - idx;
        interpolated.push(interpolatePoint(trajectory[idx], trajectory[idx + 1], alpha));
    }
    interpolated.push(trajectory[n - 1]);
    return interpolated;
}

export function euclideanDistance(trajectory1, trajectory2) {
    const n = trajectory1.length;
    const m = trajectory2.length;
    if (n == 0 || m == 0) {
        return 0;
    }
    const maxLength = Math.max(n, m);
    if (trajectory1.length < maxLength) {
        trajectory1 = interpolateTrajectory(trajectory1, maxLength);
    } else if (trajectory2.length < maxLength) {
        trajectory2 = interpolateTrajectory(trajectory2, maxLength);
    }

    let distance = 0;
    for (let i = 0; i < maxLength; i++) {
        const dx = trajectory1[i]['positionX'] - trajectory2[i]['positionX'];
        const dy = trajectory1[i]['positionY'] - trajectory2[i]['positionY'];
        distance += Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
}

export function angleBasedSimilarity(trajectory1, trajectory2) {
    const n = trajectory1.length;
    const m = trajectory2.length;
    if (n == 0 || m == 0) {
        return 0;
    }
    const maxLength = Math.max(n, m);
    if (trajectory1.length < maxLength) {
        trajectory1 = interpolateTrajectory(trajectory1, maxLength);
    } else if (trajectory2.length < maxLength) {
        trajectory2 = interpolateTrajectory(trajectory2, maxLength);
    }

    let angleDifferenceSum = 0;
    for (let i = 1; i < maxLength; i++) {
        const angle1 = computeAngle(trajectory1[i - 1], trajectory1[i]);
        const angle2 = computeAngle(trajectory2[i - 1], trajectory2[i]);
        angleDifferenceSum += Math.abs(angle1 - angle2);
    }

    return angleDifferenceSum;
}

export function dtw(trajectory1, trajectory2) {
    const n = trajectory1.length;
    const m = trajectory2.length;
    if (n == 0 || m == 0) {
        return 0;
    }
    const costMatrix = Array.from({length: n}, () => Array(m).fill(Infinity));

    costMatrix[0][0] = 0;
    for (let i = 1; i < n; i++) {
        const dx = trajectory1[i]['positionX'] - trajectory2[0]['positionX'];
        const dy = trajectory1[i]['positionY'] - trajectory2[0]['positionY'];
        costMatrix[i][0] = costMatrix[i - 1][0] + Math.sqrt(dx * dx + dy * dy);
    }

    for (let j = 1; j < m; j++) {
        const dx = trajectory1[0]['positionX'] - trajectory2[j]['positionX'];
        const dy = trajectory1[0]['positionY'] - trajectory2[j]['positionY'];
        costMatrix[0][j] = costMatrix[0][j - 1] + Math.sqrt(dx * dx + dy * dy);
    }

    for (let i = 1; i < n; i++) {
        for (let j = 1; j < m; j++) {
            const dx = trajectory1[i]['positionX'] - trajectory2[j]['positionX'];
            const dy = trajectory1[i]['positionY'] - trajectory2[j]['positionY'];
            const cost = Math.sqrt(dx * dx + dy * dy);
            costMatrix[i][j] = cost + Math.min(costMatrix[i - 1][j], costMatrix[i][j - 1], costMatrix[i - 1][j - 1]);
        }
    }

    return costMatrix[n - 1][m - 1];
}
