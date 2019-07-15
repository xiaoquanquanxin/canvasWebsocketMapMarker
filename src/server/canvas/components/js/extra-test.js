
//  测试

//  测试坐标精准度
function testCoordinatePrecision(testPoint) {
    // 测试四角--证明坐标系准确性
    __testCorner(bottom_differ, left_differ, bottomLineParams.k * leftLineParams.k);
    //  测试点位
    testPoint && drawRound(calculatePoint(testPoint), 10, 'red');
}

