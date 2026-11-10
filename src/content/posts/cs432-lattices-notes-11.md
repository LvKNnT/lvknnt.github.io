---
title: "[CS432] Lattices-Based Cryptography - Chapter 12"
date: 2026-11-03
description: "Six applications of LLL to lattice attacks and number theory"
series: "Lattices-Based Cryptography Course"
seriesOrder: 11
---

# LLL APPLICATIONS

These are my notes on Chapter 12 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 12.1 Primal attack on short-secret LWE
- 12.2 Dual attack on $\mathrm{SIS}_2$
- 12.3 Finding integer relations
- 12.4 Simultaneous Diophantine approximation
- 12.5 Side-channel attack on ECDSA
- 12.6 Finding small roots of a polynomial modulo $N$

The recurring method is to encode a hidden answer as a lattice vector unusually short relative to the lattice's volume. Run LLL, inspect its reduced basis for that vector, and verify any candidate in the original problem. LLL's worst-case guarantee does not ensure the candidate appears; the examples use the stronger behavior often observed in suitable instances.

## 12.1 Primal attack on short-secret LWE

Suppose $t=As+e\bmod q$ with both $s$ and $e$ small. Construct

$$
L=\{(x_1,x_2,x_3)\in\mathbb Z^{m+n+1}:x_1+Ax_2-tx_3=0\pmod q\}.
$$

The target $(e,s,1)$ belongs to $L$ because $e+As-t=0\bmod q$. If its length is conspicuously below that of ordinary lattice vectors, LLL may expose it. Reading its middle coordinates recovers $s$. This is the concrete version of the primal attack described in Chapters 4 and 11.

## 12.2 Dual attack on $\mathrm{SIS}_2$

For a matrix $A$, build the kernel lattice $L_A^\perp=\{z\in\mathbb Z^m:Az=0\bmod q\}$. Reduce a basis with LLL and test short basis vectors for $\|z\|_2\le B$. A passing nonzero vector solves $\mathrm{SIS}_2$. The attack is called dual in the chapter's coding-theoretic sense; the modular kernel acts like the integer lift of a dual code.

## 12.3 Finding integer relations

An integer relation among real numbers $\beta_1,\ldots,\beta_n$ is a nonzero $c\in\mathbb Z^n$ with $\sum_i c_i\beta_i=0$. With rational approximations $\alpha_i\approx\beta_i$ and a large scale $Q$, form lattice vectors

$$
\left(c_1,\ldots,c_n,\ Q\sum_i c_i\alpha_i\right).
$$

A short vector has small coefficients and a small residual, making it a plausible relation. Because finite precision can create false relations, any candidate needs higher-precision verification and ideally an exact proof.

## 12.4 Simultaneous Diophantine approximation

The task is to approximate several real numbers by fractions sharing one modest denominator: $p_i/q\approx\beta_i$. Build a lattice whose vectors contain the residuals $p_i-q\alpha_i$ plus a scaled copy of $q$. A short vector balances small errors against a small denominator. LLL's bound on its first basis vector gives explicit bounds on both quantities in the chapter's construction.

## 12.5 Side-channel attack on ECDSA

ECDSA signatures satisfy $s=k^{-1}(m+ar)\bmod n$, with long-term secret $a$ and per-signature nonce $k$. If side-channel leakage reveals that several nonces are small or partly known, each signature yields a linear congruence involving $a$ and a small unknown. Combining signatures produces a lattice whose short vectors encode the missing nonce information. LLL can then recover a nonce and hence $a$. The lesson is about nonce leakage in an implementation, not a break of correctly generated ECDSA nonces.

## 12.6 Finding small roots of a polynomial modulo $N$

Coppersmith's method uses LLL to find a small root $x_0$ of a polynomial congruence $f(x_0)=0\bmod N$ without factoring the composite modulus $N$. It constructs several polynomial multiples that still vanish at $x_0$ modulo powers of $N$, places their coefficients in a lattice, and asks LLL for a short combination. If the resulting integer polynomial is small enough at $x_0$, the modular zero must also be an exact integer zero, which can then be found by ordinary root methods.

For suitable monic degree-$d$ polynomials, the chapter states the familiar small-root threshold around $|x_0|\le N^{1/d}$. Its RSA examples show how predictable or insufficient padding can turn an unknown message part into just such a small root.

## Exercise

**Adapted from Exercise 12.5(a).** Suppose a lattice has an orthogonal basis $b_1,\ldots,b_n$. Why does rounding each coefficient of $t=\sum_i t_i b_i$ to the nearest integer return an exact closest lattice vector?

## Solution

Every lattice vector is $x=\sum_i z_i b_i$ with $z_i\in\mathbb Z$. Orthogonality removes all cross terms:

$$
\|t-x\|_2^2=\sum_i(t_i-z_i)^2\|b_i\|_2^2.
$$

Each summand is minimized independently by choosing $z_i$ as a nearest integer to $t_i$. The resulting vector minimizes the full distance, so Babai's coefficient rounding solves CVP exactly for an orthogonal basis. Ties can give more than one closest vector.
