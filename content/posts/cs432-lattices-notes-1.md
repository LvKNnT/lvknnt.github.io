---
title: [CS432] Lattices-Based Cryptography - Chapter 2
date: 2026-11-03
description: Lattices
series: Lattices-Based Cryptography Course
seriesOrder: 1
---

# LATTICES

These are my notes on Chapter 2 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 2.1 Basic definitions
- 2.2 Examples
- 2.3 Bases of a lattice
- 2.4 Successive minima
- 2.5 Fundamental lattice problems

## 2.1 Basic definitions

A lattice is a regularly spaced set of points built from **integer**, rather than real, combinations of independent vectors. If the columns of $B\in\mathbb R^{n\times m}$ are $b_1,\ldots,b_m$, then

$$
L(B)=\left\{Bz=\sum_{i=1}^{m}z_i b_i:z\in\mathbb Z^m\right\}.
$$

The ambient dimension is $n$ and the lattice rank is $m\le n$. A lattice is **full rank** when $m=n$. Equivalently, a lattice is a discrete additive subgroup of $\mathbb R^n$: it is closed under addition and subtraction, and its points do not accumulate. Cryptography mostly uses integer lattices, where $L\subseteq\mathbb Z^n$.

We measure a vector by its Euclidean norm $\|x\|_2=\sqrt{\sum_i x_i^2}$ or infinity norm $\|x\|_\infty=\max_i|x_i|$. A sublattice $L'\subseteq L$ can be sparser than $L$ even when both have full rank.

## 2.2 Examples

The identity matrix generates $\mathbb Z^n$. In two dimensions, the basis $[(2,0),(0,1)]$ generates all integer points with an even first coordinate. It is a proper sublattice of $\mathbb Z^2$ because $(1,0)$ is missing.

The **fundamental parallelepiped** of a full-rank basis is

$$
P(B)=\{Bx:x\in[0,1)^n\}.
$$

Its translates by lattice vectors tile $\mathbb R^n$. The shape depends on the basis, but its volume does not. This gives a geometric picture of why a lattice can have many very different bases.

## 2.3 Bases of a lattice

Swapping basis vectors, negating one, or adding an integer multiple of one to another preserves the lattice. In matrix form, two full-rank bases $B_1$ and $B_2$ generate the same lattice exactly when

$$
B_2=B_1U,\qquad U\in\mathbb Z^{n\times n},\quad\det U=\pm1.
$$

Such a $U$ is **unimodular**. The determinant condition matters: it makes $U^{-1}$ an integer matrix, so both bases generate each other's vectors by integer combinations.

The lattice volume is $\operatorname{vol}(L)=|\det B|$. Since a unimodular change only changes the determinant's sign, volume is independent of the chosen basis. A larger volume means a sparser point set.

Basis quality does matter for computation. A short, nearly orthogonal basis exposes short lattice vectors; a long, skewed basis of the same lattice can hide them. LLL and BKZ later try to improve a given basis without changing its lattice.

## 2.4 Successive minima

The $i$th successive minimum $\lambda_i(L)$ is the smallest radius of a ball centered at the origin containing $i$ linearly independent lattice vectors. Thus

$$
\lambda_1(L)\le\lambda_2(L)\le\cdots\le\lambda_n(L),
$$

and $\lambda_1(L)$ is the length of a shortest nonzero lattice vector. The vectors realizing the minima need not form a basis.

Volume constrains how short a lattice vector can be. The chapter's form of Minkowski's theorem gives

$$
\lambda_1(L)\le\sqrt n\,\operatorname{vol}(L)^{1/n}.
$$

The Gaussian heuristic suggests that a typical lattice has $\lambda_1(L)\approx\sqrt{n/(2\pi e)}\,\operatorname{vol}(L)^{1/n}$, but this is a heuristic, not a guarantee for every lattice. Minkowski's second theorem similarly constrains the geometric mean of all the successive minima.

## 2.5 Fundamental lattice problems

- **SVP:** Given a basis of $L$, find a nonzero vector of length exactly $\lambda_1(L)$. In $\mathrm{SVP}_\gamma$, any vector of length at most $\gamma\lambda_1(L)$ suffices.
- **SIVP:** Find $n$ linearly independent vectors, each of length at most $\lambda_n(L)$. The approximate version permits $\gamma\lambda_n(L)$. Linear independence alone does not ensure these vectors form a basis.
- **CVP:** Given a target $t$, find $x\in L$ minimizing $\|t-x\|_2$. In $\mathrm{CVP}_\gamma$, the distance may be at most $\gamma\operatorname{dist}(t,L)$.

Babai's rounding method writes $t=\sum_i\alpha_i b_i$ in a lattice basis and rounds each $\alpha_i$ to an integer. It returns a lattice point, but its quality depends strongly on the basis. These problems and their approximation factors connect the geometry of lattices to the security of SIS, LWE, and the schemes in later chapters.

## Exercise

**Adapted from Exercise 2.11.** Let $L$ have basis $b_1=(2,0)$ and $b_2=(0,3)$. Find $\lambda_1(L)$.

## Solution

Every lattice vector is $(2a,3b)$ for integers $a,b$, so its squared length is $4a^2+9b^2$. For a nonzero vector, this is at least $4$. The vectors $(2,0)$ and $(-2,0)$ attain that bound. Therefore $\lambda_1(L)=2$.
