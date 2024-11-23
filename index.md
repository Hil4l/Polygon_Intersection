---
title: Polygon intersection detection
---

> Author: RACHIK Hilal, KLEIJKERS Jean-Philippe
> 
> Date: October 2024

## Introduction

problem: determine if two convex polygons P and Q intersect.

## Algorithm 1

#### Chazelle and Dobkin algorithm
<iframe
  src="https://codesandbox.io/embed/convex-hull-vertices-qhhzs3?fontsize=14&hidenavigation=1&theme=dark&view=preview"
  style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden;"
  title="CodeSandbox Applet"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Algorithm 2

Barba and Langerman algorithm, aims to show an alternate and hopefully simpler algorithm to solve this problem.

#### Definitions

+ V(P) and E(P) are the set of vertices and edges of P, respectively.
+ ∂P is the boundary of P.
+ edge hull of E is the intersection of the supporting halfplanes of each edges in E.
+ vertex-median of a polygonal chain is a vertex whose removal splits this chain into two pieces that differ by at most one vertex.
+ edge-median of a polygonal chain is an edge whose removal splits the chain into two parts that differ by at most one edge.

#### Structures

Throughout the algorithm, we will interact with the polygons through 2 structures:

+ Tp: the convex hull of three vertices of P (traingle), such that their removal split ∂P into 3 chains of at most ⌈(n−3)/3⌉ vertices.

+ Tq: the edge hull of three edges of Q (triangle - possibly unbounded), such that their removal split ∂Q into 3 chains of at most ⌈(m−3)/3⌉ edges.

<center><img src="assets/images/Tp_and_Tq.png" width="400" height="250" /><br><span>Figure 1: Tp and Tq</span></center>

(TP ⊆ P while Q ⊆ TQ)

### Invariants

+ **Correctness** invariant: 

+ **Separation** invariant: there is a line l that separates TP from TQ such that l is tangent to TP at a vertex v.

+ **Intersection** invariant: there is a point in the intersection between TP and TQ.

### Algorithm

Alternate between pruning steps depending on which invariant holds.
After prunning update Tp or Tq, check holding invariants with Tp/Tq intersection test, repeat.


**Separation invariant step**

Define separating line l (exists).

Consider the 2 closed halfplanes l- and l+ supported by l such that TP ⊆ l-.

Consider the 2 neighbours nv and nvp of v along ∂P.

+ both neighbours in l-

Then l separates P from Tq (P convexity) and Q ⊆ TQ so l separates P from Q.

+ neighbours in different halfplanes

(nv in l+ / nvp in l-)

The removal of the vertices of TP split ∂P into three polygonal chains, only one, let cv, intersects l+, we consider its both endpoints v (by construction) and let u the other endpoint.

Because `Q ⊆ l+, only cv vertices can define an intersection with Q` (other points not in the same halfplane - separated).
Therefore, we can prune V∗(P) by removing every vertex of P that does not lie on cv and maintain the correctness invariant.

<!-- **nv and nvp both in l+ image** **nv in l+ and nvp in l- image** -->

**Intersection invariant step**

TODO

### Separation invariant applet

<iframe
  src="https://codesandbox.io/embed/separation-invariant-j73nhp?fontsize=14&hidenavigation=1&theme=dark&view=preview"
  style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden;"
  title="CodeSandbox Applet"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Complexity
O(log(|P|) + log(Q))

### 3D algorithm link

provides some intuition for the higher-dimension algorithms presented in subsequent sections

## References
[1] [Barba, Luis, and Stefan Langerman. "Optimal detection of intersections between convex polyhedra." Proceedings of the Twenty-Sixth Annual ACM-SIAM Symposium on Discrete Algorithms. Society for Industrial and Applied Mathematics, 2014.](https://arxiv.org/abs/1312.1001)