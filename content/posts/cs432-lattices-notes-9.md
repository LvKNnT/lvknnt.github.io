---
title: [CS432] Lattices-Based Cryptography - Chapter 10
date: 2026-11-03
description: Gram-Schmidt, Gauss reduction, LLL, and its approximation guarantee
series: Lattices-Based Cryptography Course
seriesOrder: 9
---

# THE LLL LATTICE BASIS REDUCTION ALGORITHM

These are my notes on Chapter 10 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 10.1 Gram-Schmidt orthogonalization
- 10.2 Gauss's algorithm
- 10.3 The LLL algorithm
- 10.4 LLL improvements

## 10.1 Gram-Schmidt orthogonalization

Given independent basis vectors $b_1,\ldots,b_n$, Gram-Schmidt subtracts the part of each $b_i$ already explained by earlier vectors:

$$
b_i^*=b_i-\sum_{j<i}\mu_{ij}b_j^*,
\qquad
\mu_{ij}=\frac{\langle b_i,b_j^*\rangle}{\|b_j^*\|_2^2}.
$$

The resulting $b_i^*$ are mutually orthogonal and span the same **real vector space** as the original basis. They are usually not lattice vectors. This matters: Gram-Schmidt is a way to measure and guide lattice basis changes, not itself a lattice basis reduction.

For a full-rank lattice, $\operatorname{vol}(L)=\prod_i\|b_i^*\|_2$. Volume cannot change when a lattice basis is transformed by unimodular operations, but the individual Gram-Schmidt lengths can. A skewed basis often has very long early vectors and rapidly shrinking later projections; LLL tries to rebalance them.

## 10.2 Gauss's algorithm

In two dimensions, Gauss reduction repeatedly shortens one basis vector by subtracting an integer multiple of the other. For an ordered pair $[u,v]$, compute $\mu=\langle u,v\rangle/\|u\|_2^2$ and replace $v$ by $v-\lfloor\mu\rceil u$, then swap vectors as needed. The integer operation preserves the lattice.

When no shortening step remains, the reduced pair reaches the two successive minima: $\|u\|_2=\lambda_1(L)$ and $\|v\|_2=\lambda_2(L)$. In higher dimensions, local reductions no longer give an exact shortest-vector algorithm, which motivates LLL.

## 10.3 The LLL algorithm

A basis is **size-reduced** when $|\mu_{ij}|\le\tfrac12$ for every $j<i$. LLL also requires the Lovász condition, with the chapter's standard value $\delta=\tfrac34$:

$$
\|b_i^*\|_2^2\ge
\left(\frac34-\mu_{i,i-1}^2\right)\|b_{i-1}^*\|_2^2
\quad(2\le i\le n).
$$

Size reduction limits the components parallel to earlier basis vectors. The Lovász condition prevents projected lengths from collapsing too quickly along the basis.

The algorithm first size-reduces, swaps adjacent vectors when the Lovász condition fails, and repeats until every adjacent pair passes. All operations preserve the lattice. A potential based on prefix volumes decreases at swaps, giving termination and polynomial running time for integer inputs with appropriately represented arithmetic.

LLL does **not** promise an exact SVP solution in general. Its first vector satisfies

$$
\|b_1\|_2\le 2^{(n-1)/2}\lambda_1(L),
\qquad
\|b_1\|_2\le 2^{(n-1)/4}\operatorname{vol}(L)^{1/n}.
$$

The exponential approximation factor explains both its usefulness as a fast first reduction and its limitations for hard high-dimensional lattices.

## 10.4 LLL improvements

Practical versions update only the Gram-Schmidt data affected by a swap, choose a Lovász parameter $\delta$ between $\tfrac14$ and $1$, and often use floating-point approximations with care. Deeper insertions can improve output quality at extra cost. BKZ, in the next chapter, extends the local idea from adjacent pairs to larger blocks.

## Exercise

**Adapted from Exercise 10.6.** For $b_1=(1,2,1)$, $b_2=(2,1,1)$, and $b_3=(1,1,2)$, compute their Gram-Schmidt vectors and verify that their lengths multiply to the lattice volume.

## Solution

The first vector is $b_1^*=b_1$. Since $\langle b_2,b_1\rangle/\|b_1\|^2=5/6$,

$$
b_2^*=b_2-\frac56b_1
=\left(\frac76,-\frac23,\frac16\right).
$$

The remaining projection coefficients are $\mu_{31}=5/6$ and $\mu_{32}=5/11$, giving

$$
b_3^*=b_3-\frac56b_1^*-\frac5{11}b_2^*
=\left(-\frac4{11},-\frac4{11},\frac{12}{11}\right).
$$

Their squared lengths are $6$, $11/6$, and $16/11$. Thus $\prod_i\|b_i^*\|=\sqrt{6\cdot(11/6)\cdot(16/11)}=4$. The matrix with columns $b_1,b_2,b_3$ has determinant $-4$, so $\operatorname{vol}(L)=|-4|=4$, as expected.
