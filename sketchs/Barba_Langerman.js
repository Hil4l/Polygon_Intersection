/* eslint-disable no-undef, no-unused-vars */

/*
Hilal Rachik 520550
----------------------
usage:
*/

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// globals
var points = [];
var titleText = "Separation Invariant Step";

var P = [];
var Q = [];
var Tp = [];
var Tq = [];

var L = [];
var v = null;

var min_x = 100;
var min_y = 280;

function buildExample() {
  let ls_p = [
    [410, 385],
    [439, 368],
    [459, 339],
    [464, 291],
    [445, 254],
    [407, 236],
    [328, 236],
    [299, 276],
    [298, 344],
    [327, 383],
  ];

  for (let [x, y] of ls_p) {
    P.push(new Point(x, y));
  }

  let ls_q = [
    [658, 434],
    [702, 422],
    [734, 400],
    [751, 351],
    [752, 295],
    [727, 240],
    [633, 215],
    [588, 220],
    [555, 256],
    [536, 310],
    [530, 359],
    [550, 399],
    [593, 428],
  ];

  for (let [x, y] of ls_q) {
    Q.push(new Point(x, y));
  }
}

function resetpoints() {
  points = [];
  P = [];
  Q = [];
  Tp = [];
  Tq = [];
  L = [];
  v = null;
}

function orientationDet(a, b, c) {
  // p5.js origin at top-left corner (y-axis inversed from course example) --> (a.y - b.y) instead of (b.y - a.y) ...
  let det = (b.x - a.x) * (b.y - c.y) - (a.y - b.y) * (c.x - b.x);

  if (det > 0) {
    // left turn
    return -1;
  } else if (det < 0) {
    // right turn
    return 1;
  } else {
    // collinear
    return 0;
  }
}

function orientDetComp(ref, a, b) {
  // Comparator based on orientation determinant
  if (a === ref) return -1;
  if (b === ref) return 1;

  return orientationDet(ref, a, b); // left (a before b) / right (a after b)
}

function grahamScan(S) {
  if (points.length < 1) {
    console.log("Graham Scan: not enough points");
    return null;
  }

  // Select lowest point (as reference)
  var lowest = points[0];
  for (let i = 1; i < points.length; i++) {
    var p = points[i];
    if (p.y > lowest.y) {
      // assume no colinear lowest point, if yes then add "|| (p.y == lowest.y && p.x < lowest.x)"
      lowest = p;
    }
  }

  // Sort points through orientation det. from lowest point
  points.sort((a, b) => orientDetComp(lowest, a, b));

  // Process remaining n-1 points
  S.push(points[0]);
  S.push(points[1]);
  S.push(points[2]);

  let n = S.length;
  for (let i = 3; i < points.length; i++) {
    // pop S until last 3 points (in order) form a left turn (det > 0 but return -1 so <)
    while (n > 2 && orientationDet(S[n - 2], S[n - 1], points[i]) > 0) {
      S.pop();
      n--;
    }
    S.push(points[i]);
    n++;
  }
  points = []; // reset points for second polygon
}

function lineIntersection(p1, p2, p3, p4) {
  // Line 1: (p1, p2), Line 2: (p3, p4)
  let a1 = p2.y - p1.y;
  let b1 = p1.x - p2.x;
  let c1 = a1 * p1.x + b1 * p1.y;

  let a2 = p4.y - p3.y;
  let b2 = p3.x - p4.x;
  let c2 = a2 * p3.x + b2 * p3.y;

  let determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return null; // parallel
  }

  let x = (b2 * c1 - b1 * c2) / determinant;
  let y = (a1 * c2 - a2 * c1) / determinant;

  let p = new Point(x, y);

  return p;
}

function defineTQ() {
  let n = Q.length;
  // let chainLength = Math.ceil((n - 3) / 3);

  // Identify three edges
  let e1 = [Q[0], Q[1]];
  let e2 = [Q[Math.floor(n / 3)], Q[Math.floor(n / 3) + 1]];
  let e3 = [Q[Math.floor((2 * n) / 3)], Q[Math.floor((2 * n) / 3) + 1]];

  // Find the vertices of TQ
  let v1 = lineIntersection(e1[0], e1[1], e2[0], e2[1]); // e1 / e2
  let v2 = lineIntersection(e2[0], e2[1], e3[0], e3[1]); // e2 / e3
  let v3 = lineIntersection(e3[0], e3[1], e1[0], e1[1]);

  if (!(v1 && v2 && v3)) {
    console.log("Edges do not form a closed plane.");
    return null;
  }

  Tq = [v1, v2, v3];
}

function defineTp() {
  let n = P.length;
  Tp = [P[0], P[Math.floor(n / 3)], P[Math.floor((2 * n) / 3)]];
}

function buildTriangles() {
  if (P.length > 0) {
    defineTp();
  }

  if (Q.length > 0) {
    defineTQ();
  }
}

function getTriangleSide(T, lineStart, lineEnd) {
  let res = 0;
  for (let point of T) {
    // ignore
    if (point != lineStart && point != lineEnd) {
      res += orientationDet(lineStart, lineEnd, point);
    }
  }

  // -2 --> all points left / 2 --> all points right / 0 --> different sides
  return res;
}

function getPreviousElement(arr, i) {
  // Calculate the previous index, wrapping around to the last index
  const prevIndex = (i - 1 + arr.length) % arr.length;
  return arr[prevIndex];
}

// find a separating line for Tp and Tq, return true if found / else false
function findL() {
  for (const p of Tp) {
    for (const q of Tq) {
      let TpSide = getTriangleSide(Tp, p, q);
      let TqSide = getTriangleSide(Tq, p, q);

      // both triangles on a side and a different one
      if (TpSide != 0 && TqSide != 0 && TpSide != TqSide) {
        L = [p, q]; // save L
        v = p; // save v
        return true;
      }
    }
  }

  // L not found
  console.log("Separating line not found");
  return false;
}

function prune() {
  let n = P.length;

  let v_ind = P.findIndex((p) => p.x === v.x && p.y === v.y);
  let v_n = P[(v_ind + 1) % n];
  let v_n_p = v_ind != 0 ? P[v_ind - 1] : P[n - 1];

  let v_n_turn = orientationDet(L[0], L[1], v_n);
  let v_n_P_turn = orientationDet(L[0], L[1], v_n_p);

  // if v_n and v_n_p belongs to l+ --> done (P and Q separated)
  if (v_n_turn == v_n_P_turn) {
    console.log("Both v_n and v_n_p belong to l+, P and Q dont intersect");
    return true;
  } else {
    // else find u and prune P keeping only vertices of c_v (v to u)

    // u is next Tp vertex (anti clk wise) if v_n on same side as tq
    // u is previous Tp vertex (anti clk wise) if v_n_p on same side as tq
    let Tq_side_of_l = Math.sign(getTriangleSide(Tq, L[0], L[1]));
    let v_Tp_ind = Tp.findIndex((p) => p.x === v.x && p.y === v.y);
    let c_v = [];

    let u_ind = 0;
    if (orientationDet(L[0], L[1], v_n_p) == Tq_side_of_l) {
      u_ind = (v_Tp_ind + 2) % 3;
      u = Tp[u_ind];

      // build c_v (clk wise)
      let i = v_ind;
      while (P[i] != u) {
        c_v.push(P[i]);
        i = i != 0 ? i - 1 : n - 1;
      }
      c_v.push(u);
    } else {
      u_ind = (v_Tp_ind + 1) % 3;
      u = Tp[u_ind];

      // build c_v (anti clk wise)
      let i = v_ind;
      while (P[i] != u) {
        c_v.push(P[i]);
        i = (i + 1) % n;
      }
      c_v.push(u);
    }

    // prune P
    P = c_v;

    // update Tp
    let m = Math.floor(c_v.length / 2); // vertex median
    Tp = [v, P[m], u];

    // reset L
    L = [];
  }
}

function lineSegmentIntersTest(a, b, c, d) {
  let test1 = orientationDet(a, b, c) != orientationDet(a, b, d);
  let test2 = orientationDet(c, d, a) != orientationDet(c, d, b);
  return test1 && test2;
}

function polygonIntersecTest(P1, P2) {
  // Brute force intersection test

  let n = P1.length;
  let m = P2.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (
        lineSegmentIntersTest(P1[i], P1[(i + 1) % n], P2[j], P2[(j + 1) % m])
      ) {
        return true;
      }
    }
  }

  return false;
}

function testIntersecTpTq() {
  if (polygonIntersecTest(Tp, Tq)) {
    console.log("Tp and Tq intersect -> intersection invariant holds");
  } else {
    console.log(
      "Tp and Tq dont intersect -> separation invariant still holding"
    );
  }
}

// ------------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill("black");
  textSize(40);

  // clear
  clrButton = createButton("Clear");
  clrButton.position(30, 80);
  clrButton.mousePressed(resetpoints);

  // convex hull P
  chPButton = createButton("CH(P)");
  chPButton.position(30, 130);
  chPButton.mousePressed(() => grahamScan(P)); // Using an arrow function

  // convex hull Q
  chQButton = createButton("CH(Q)");
  chQButton.position(30, 160);
  chQButton.mousePressed(() => grahamScan(Q)); // Using an arrow function

  // P/Q pre build examples
  findLButton = createButton("P/Q example");
  findLButton.position(30, 190);
  findLButton.mousePressed(buildExample);

  // Triangles data structs
  trainglesButton = createButton("Tp / Tq");
  trainglesButton.position(30, 240);
  trainglesButton.mousePressed(buildTriangles);

  // separating line
  findLButton = createButton("Find 'l'");
  findLButton.position(30, 290);
  findLButton.mousePressed(findL);

  // pruning step
  findLButton = createButton("prune");
  findLButton.position(30, 340);
  findLButton.mousePressed(prune);

  // step end test
  findLButton = createButton("test");
  findLButton.position(30, 390);
  findLButton.mousePressed(testIntersecTpTq);
}

function draw() {
  stroke("black");
  fill("black");
  background(200);

  // texts
  text(titleText, 30, 50);

  drawPoints(points, "black");

  drawCH(P);
  drawCH(Q);

  drawTriangle(Tp);
  drawTriangle(Tq);

  drawLine(L, "green");

  // drawPoints(c_v, "red");
}

function drawPoints(ls, col) {
  stroke(col);
  for (let i = 0; i < ls.length; i++) {
    let p = ls[i];
    ellipse(p.x, p.y, 4, 4);
  }
}

function drawCH(S) {
  stroke("black");
  let n = S.length;
  for (let i = 0; i < n; i++) {
    ellipse(S[i].x, S[i].y, 4, 4);
    line(S[i].x, S[i].y, S[(i + 1) % n].x, S[(i + 1) % n].y);
  }
}

function drawLine(l, col) {
  stroke(col);
  if (l.length > 0) {
    // line defined
    line(l[0].x, l[0].y, l[1].x, l[1].y);
  }
}

function drawTriangle(T) {
  let n = T.length;
  for (let i = 0; i < n; i++) {
    stroke("magenta");
    line(T[i].x, T[i].y, T[(i + 1) % n].x, T[(i + 1) % n].y);
  }
}

function isInside(mouseX, mouseY) {
  // avoid placing points on buttons
  return mouseX > min_x || mouseY > min_y;
}

function mousePressed() {
  if (isInside(mouseX, mouseY)) {
    points.push(new Point(mouseX, mouseY));
  }
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
