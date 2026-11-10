---
title: "[CS432] Lattices-Based Cryptography - Chapter 5"
date: 2026-11-03
description: "Polynomial rings and the module variants of SIS and LWE"
series: "Lattices-Based Cryptography Course"
seriesOrder: 4
---

# MODULE-SIS AND MODULE-LWE

These are my notes on Chapter 5 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 5.1 The polynomial ring $R_q$
- 5.2 Module-SIS (MSIS)
- 5.3 Module-LWE (MLWE)

## 5.1 The polynomial ring $R_q$

The module problems replace scalar arithmetic in $\mathbb Z_q$ with arithmetic in

$$
R_q=\mathbb Z_q[x]/(x^n+1).
$$

An element has a unique representative of degree below $n$. Add coefficients modulo $q$; multiply polynomials normally, then reduce using $x^n=-1$. For example, when $n=4$, terms $x^4,x^5,x^6$ become $-1,-x,-x^2$. This is **negacyclic** multiplication.

A polynomial $a_0+a_1x+\cdots+a_{n-1}x^{n-1}$ can also be treated as its coefficient vector. Multiplication by a fixed polynomial then becomes multiplication by a structured anti-circulant matrix. This shows that module problems can be viewed as ordinary lattice problems with extra algebraic structure. The Number-Theoretic Transform in Chapter 13 makes this multiplication fast.

Use centered representatives modulo $q$ to measure size. For $f=\sum_i f_i x^i$, define $\|f\|_\infty=\max_i|f_i\operatorname{mods}q|$ and $S_\eta=\{f\in R_q:\|f\|_\infty\le\eta\}$. If $\|f\|_\infty\le\eta_1$ and $\|g\|_\infty\le\eta_2$, every coefficient of $fg$ has at most $n$ summands. Provided $n\eta_1\eta_2<q/2$, this gives $\|fg\|_\infty\le n\eta_1\eta_2$ without wraparound obscuring the bound.

## 5.2 Module-SIS (MSIS)

A module vector contains polynomials rather than integers. For $A\in R_q^{k\times\ell}$ with $k<\ell$, MSIS asks for a nonzero vector $z\in R_q^\ell$ such that

$$
Az=0\quad\text{in }R_q^k,\qquad \|z\|_\infty\le\eta.
$$

Here the norm is the largest centered coefficient among all components. As in SIS, the hard part is finding a **small** relation, not merely solving a linear equation. The inhomogeneous variant MISIS changes the target to $Az=b$; its normal form uses $[A\mid I_k]z=b$. These are the module analogues of the Chapter 3 formulations and are relevant to Dilithium's signature security.

Multiplying an MSIS solution by $x$ preserves the relation and its coefficient bound: in $R_q$, multiplication by $x$ rotates coefficients and changes one sign. A solution can therefore lead to several related solutions.

## 5.3 Module-LWE (MLWE)

For a random $A\in R_q^{k\times\ell}$, a secret $s\in R_q^\ell$, and small error $e\in S_\eta^k$, publish

$$
t=As+e\quad\text{in }R_q^k.
$$

Search MLWE asks for $s$; decisional MLWE asks whether $t$ is noisy-linear or uniformly random. Short-secret versions also draw $s$ from a small-coefficient set. The module structure packs many coefficient equations into a compact polynomial matrix and enables fast arithmetic, but its hardness assumption is about this structured distribution, not automatically about every ordinary LWE instance. Kyber uses the short-secret decisional form; Dilithium uses module-LWE alongside module-SIS.

## Exercise

**Practice exercise based on Section 5.1.** In $R_{17}=\mathbb Z_{17}[x]/(x^4+1)$, multiply $f=1+2x^3$ and $g=3+x^2$.

## Solution

Ordinary multiplication gives $fg=3+x^2+6x^3+2x^5$. Since $x^4=-1$ in this ring, $x^5=-x$. Reducing coefficients modulo $17$ then gives

$$
fg=3-2x+x^2+6x^3=3+15x+x^2+6x^3\quad\text{in }R_{17}.
$$
