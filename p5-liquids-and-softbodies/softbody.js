// https://github.com/liabru/matter-js/blob/master/examples/softBody.js
function softBody(
    xx,
    yy,
    columns,
    rows,
    columnGap,
    rowGap,
    crossBrace,
    particleRadius,
    particleOptions,
    constraintOptions
) {
    var Common = Matter.Common,
        Composites = Matter.Composites,
        Bodies = Matter.Bodies;

    particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.2 }, constraintOptions);

    var softBody = Composites.stack(
        xx,
        yy,
        columns,
        rows,
        columnGap,
        rowGap,
        function (x, y) {
            return Bodies.circle(x, y, particleRadius, particleOptions);
        }
    );

    Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

    softBody.label = "Soft Body";

    return softBody;
}
