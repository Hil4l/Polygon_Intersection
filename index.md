---
title: Polygon intersection detection
---

> Author: RACHIK Hilal, KLEIJKERS Jean-Philippe
> 
> Date: October 2024

## Introduction

problem: determine if two convex polygons P and Q intersect.

## Algorithm 1 (KLEIJKERS Jean-Philippe)

#### Chazelle and Dobkin algorithm
<iframe
  src="https://codesandbox.io/embed/le-w5tx7f?fontsize=14&hidenavigation=1&theme=dark&view=preview"
  style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden;"
  title="CodeSandbox Applet"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

## Algorithm 2 (RACHIK Hilal)

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

+ **Correctness** invariant: an intersection between P and Q can still be computed with the prunned vertices and edges, P ∩ Q <=> ch(V∗(P)) ∩ E∗(Q).

+ **Separation** invariant: there is a line l that separates TP from TQ such that l is tangent to TP at a vertex v.

+ **Intersection** invariant: there is a point in the intersection between TP and TQ.

Alternate between pruning steps depending on which invariant holds, maintaining correctness invariant.

### Separation invariant step

Define separating line l (exists).

Consider the 2 closed halfplanes l- and l+ supported by l such that TP ⊆ l-.

Consider the 2 neighbours nv and nvp of v along ∂P.

<center><img src="assets/images/separation_cases.png" width="700" height="400" /><br><span>Figure 2: separation invariant step 2 cases</span></center>

+ **both neighbours in l-**

  + l separates P from Tq (P convexity) and Q ⊆ TQ so `l separates P from Q`.

+ **neighbours in different halfplanes**

  + The removal of the vertices of TP split ∂P into three polygonal chains, only one, let cv, intersects l+, we consider its both endpoints v (by construction) and let u the other one.

  Because Q ⊆ l+, only cv vertices can define an intersection with Q (other points not in the same halfplane - separated).
  Therefore, we can `prune V∗(P) by removing every vertex of P that does not lie on cv and maintain the correctness invariant`.

  + Redefine Tp with (v, u, m), m the vertex-median of cv.

  + Test Tp and Tq for intersection and perfrom corresponding invariant step.

### Intersection invariant step

Consider (e1, e2, e3) the 3 edges whose edge hull defines Tq.

+	**Tp intersects ch(e1, e2, e3)**

	ch(e1, e2, e3) ⊆ Q so `P and Q intersect`.

+	**Tp dont intersects ch(e1, e2, e3)**

	+ Tq \ ch(e1, e2, e3) forms 3 disjoint connected components, Tp intersects exactly one of them, let it be the one bounded by (e1,e2) and let x ∈ ∂Tq such an intersecting point.

	+ Let C the polygonal chain that connects e1 with e2 along ∂Q such that it passes through e3.

	+ If P and Q intersect, we only need to consider the edges on ∂Q\C,

	If P intersects C at a point y, x and y lies in 2 different disjoint connected components of TQ/ch(e1,e2,e3), so xy intersects ∂Q at anpother point in ∂Q/C, so any intersection between P and Q through C also involves an intersction through ∂Q/C.

	Therefore, we can `prune E∗(P) by removing every edge along C and maintain the correctness invariant`.

	+ Redefine T_q as the edge hull of (e1, e2, em), em the edge-median of ∂Q \ C edges.

	+ Test Tp and Tq for intersection and perfrom corresponding invariant step.

<center><img src="assets/images/intersection_cases.png" width="800" height="300" /><br><span>Figure 3: intersection invariant step 2 cases</span></center>

### Separation invariant applet

<iframe
  src="https://codesandbox.io/embed/separation-invariant-j73nhp?fontsize=14&hidenavigation=1&theme=dark&view=preview"
  style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden;"
  title="CodeSandbox Applet"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Complexity

+ Each time Tp is redefined, we roughly splits the remaining vertices of V*(P) along ∂P into 2 equal lenght chains through the vertex median (v and u are adjacent by construction).
Therefore, after each separation invariant step, a constant fraction of V∗(P) is prunned since only one chain is retained (cv).
So the number of separation invariant step is bounded by O(log |P|).

+ Each time Tq is redefined, we roughly split the remaining edges of E∗(Q) into equal pieces, through the edge median (e1 and e2 adjacent by construction).
Therefore, after intersection invariant step, a constant fraction of E∗(Q) is prunned, since only ∂Q \ C is retained.
So the number of intersection invariant step is bounded by O(log |Q|).

overall complexity is **O(log(|P|) + log(|Q|))**

## References
[1] [Barba, Luis, and Stefan Langerman. "Optimal detection of intersections between convex polyhedra." Proceedings of the Twenty-Sixth Annual ACM-SIAM Symposium on Discrete Algorithms. Society for Industrial and Applied Mathematics, 2014.](https://arxiv.org/abs/1312.1001)