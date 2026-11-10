---
title: [CS432] Lattices-Based Cryptography - Chapter 3
date: 2026-11-03
description: Short Integer Solution, its q-ary lattice, and hardness assumptions
series: Lattices-Based Cryptography Course
seriesOrder: 2
---

# SHORT INTEGER SOLUTION (SIS)

These are my notes on Chapter 3 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 3.1 Problem statement
- 3.2 The SIS lattice
- 3.3 Hardness of SIS

## 3.1 Problem statement

An SIS instance consists of a uniformly random $A\in\mathbb Z_q^{n\times m}$, with $m>n$, and a small bound $B<q/2$. The task is to find

$$
z\in\mathbb Z^m\setminus\{0\},\qquad Az=0\pmod q,\qquad \|z\|_\infty\le B.
$$

Ordinary elimination finds the null space of $A$ modulo $q$; it does not guarantee a representative whose **integer coordinates** are all small. When $(B+1)^m>q^n$, pigeonholing the $(B+1)^m$ vectors in $\{0,\ldots,B\}^m$ by their $q^n$ possible images guarantees a nonzero difference that solves SIS. This establishes existence, not an efficient way to find the difference.

SIS gives a simple collision-resistant hash construction. Define $H_A(x)=Ax\bmod q$ on $\{0,1\}^m$. A collision $H_A(x)=H_A(x')$ with $x\ne x'$ gives $z=x-x'\in\{-1,0,1\}^m$, which solves $\mathrm{SIS}(n,m,q,1)$. Thus a collision finder would break that SIS assumption.

The **inhomogeneous** version ISIS asks for a small $z$ satisfying $Az=b\bmod q$ for a supplied target $b$. Its normal form writes $[A\mid I_n]z=b\bmod q$, allowing a small residual in the final $n$ coordinates. The chapter relates these variants to SIS by reductions; the important distinction is whether the target is zero, nonzero, or absorbed into the extra identity block.

## 3.2 The SIS lattice

The modular kernel is an actual integer lattice:

$$
L_A^\perp=\{z\in\mathbb Z^m:Az=0\pmod q\}.
$$

Assuming $A$ has row rank $n$ over $\mathbb Z_q$, this lattice has full rank $m$ and volume $q^n$. It contains $q\mathbb Z^m$, which makes full rank clear. If row reduction puts $A$ in the form $[I_n\mid\bar A]$, an explicit basis is

$$
C=\begin{pmatrix}qI_n&-\bar A\\0&I_{m-n}\end{pmatrix}.
$$

Its determinant has magnitude $q^n$, as required. An SIS solution is therefore a short nonzero vector of $L_A^\perp$. The public matrix gives a basis, but that basis is generally poor for finding short vectors.

## 3.3 Hardness of SIS

The Euclidean variant $\mathrm{SIS}_2$ requests $0<\|z\|_2\le B$. The two norms are related by $\|z\|_\infty\le\|z\|_2\le\sqrt m\,\|z\|_\infty$, so bounds must be adjusted when moving between versions.

### Dual attack

One can construct $L_A^\perp$, reduce its basis, and look for a sufficiently short vector. This turns $\mathrm{SIS}_2$ into an approximate SVP task. Minkowski's theorem gives $\lambda_1(L_A^\perp)\le\sqrt m\,q^{n/m}$; the Gaussian heuristic predicts about $\sqrt{m/(2\pi e)}\,q^{n/m}$ for a typical instance. These estimates explain why the ratio between $B$ and the expected shortest length drives attack cost. Chapter 12 shows an explicit reduction example.

### Average-case hardness

Cryptosystems sample random matrices $A$, so hardness of an isolated worst-case lattice is insufficient. Ajtai's worst-case-to-average-case result connects average-case SIS hardness to the assumed worst-case hardness of approximate SIVP. It is conditional and asymptotic; it does not alone fix concrete scheme parameters. This result also addresses the concern that the special $q$-ary shape of $L_A^\perp$ might make random SIS instances easy.

## Exercise

**Practice exercise.** Work modulo $7$ with $A=(1\;\;2\;\;3)$ and $B=1$. Find a nonzero solution of $Az=0\bmod 7$ with $\|z\|_\infty\le1$. Use it to exhibit a collision in $H_A(x)=Ax\bmod7$ on $\{0,1\}^3$.

## Solution

Take $z=(1,1,-1)^T$: $Az=1+2-3=0$, and each coordinate has magnitude at most $1$. Split it as $z=x-x'$ with $x=(1,1,0)^T$ and $x'=(0,0,1)^T$. These distinct binary inputs both hash to $3\bmod7$, giving the requested collision.
