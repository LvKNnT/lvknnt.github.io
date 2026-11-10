---
title: "[CS432] Lattices-Based Cryptography - Chapter 4"
date: 2026-11-03
description: "Learning With Errors, LWE encryption, lattice attacks, and hardness"
series: "Lattices-Based Cryptography Course"
seriesOrder: 3
---

# LEARNING WITH ERRORS (LWE)

These are my notes on Chapter 4 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 4.1 Problem statement
- 4.2 Lindner-Peikert public-key encryption
- 4.3 The LWE lattice
- 4.4 Hardness of LWE

## 4.1 Problem statement

LWE starts from linear equations with deliberately small errors. Choose a random matrix $A\in\mathbb Z_q^{m\times n}$, a secret $s\in\mathbb Z_q^n$, and an error vector $e$ with coordinates in $[-B,B]$. Publish

$$
b=As+e\pmod q.
$$

Given $(A,b)$, **search LWE** asks for $s$. Without $e$, elimination would recover $s$; with errors, the equations are only approximately consistent. The chapter also defines **decisional LWE**, which asks whether $(A,b)$ came from this construction or whether $b$ was uniform in $\mathbb Z_q^m$. Search and decision versions are related by reductions under the chapter's parameter setting.

In **short-secret LWE**, the secret itself has small coordinates. This variant is particularly useful in efficient schemes. The text relates it to ordinary LWE, but one must track the corresponding changes in sample count and dimensions.

## 4.2 Lindner-Peikert public-key encryption

This scheme turns a short-secret LWE sample into a public key. Bob chooses short $s,e$, computes $b=As+e$, publishes $(A,b)$, and keeps $s$. To encrypt one bit $m$, Alice chooses short $r,e_1,e_2$ and forms

$$
u=A^T r+e_1,\qquad
v=b^T r+e_2+\left\lceil q/2\right\rceil m\pmod q.
$$

Bob computes $v-s^T u$ and rounds it to the nearest message region. Substitution cancels the large $A$ terms:

$$
v-s^Tu=\left\lceil q/2\right\rceil m+
\underbrace{e^Tr-s^Te_1+e_2}_{\text{decryption error}}\pmod q.
$$

Decryption works when the remaining error is small enough that rounding still identifies $m$. This separates two questions: **correctness** bounds the noise, while **security** asks whether the public key and ciphertext can be distinguished from suitable random values. The latter is based on decisional short-secret LWE.

## 4.3 The LWE lattice

The lattice associated with $A$ is

$$
L_A=\{As+qz:s\in\mathbb Z^n,\ z\in\mathbb Z^m\}\subseteq\mathbb Z^m.
$$

For full column-rank $A$ modulo $q$, it is full rank with volume $q^{m-n}$. Since $b=As+e\bmod q$, the point $b$ lies close to a vector of $L_A$; recovering that vector reveals the secret. The chapter also introduces the **dual lattice** $L^*=\{y\in\mathbb R^m:\langle y,x\rangle\in\mathbb Z\ \forall x\in L\}$, which helps explain dual attacks.

## 4.4 Hardness of LWE

### Primal attack

The error gives a nearby-lattice-point problem: find $y=As\in L_A$ close to the target $b$, with $\|b-y\|_2=\|e\|_2\le B\sqrt m$. Under a uniqueness promise this is bounded-distance decoding. Kannan's embedding places the target and lattice into one higher dimension so that the desired error can appear as an unusually short vector; basis reduction or SVP algorithms can then recover it.

### Dual attack

Find a short $x$ with $A^Tx=0\bmod q$. For an LWE sample, $b^Tx=e^Tx\bmod q$ remains small when both vectors are short. For a uniformly random $b$, the same inner product should look random modulo $q$. This supplies a distinguisher and links LWE attacks to SIS-like short relations.

### Other hardness evidence

The Arora-Ge method converts bounded errors into polynomial equations and linearizes them. It is polynomial time for a fixed small $B$, but needs many samples and has a high polynomial degree, so it is not a practical break of the instances considered here. Regev's worst-case-to-average-case reduction gives conditional evidence for random LWE hardness from worst-case approximate SIVP hardness against quantum algorithms. As with SIS, the asymptotic reduction does not directly determine concrete parameters.

## Exercise

**Adapted from Exercise 4.7(a).** For a nonzero real number $c$, determine the dual lattice of $L=c\mathbb Z^n$.

## Solution

A vector $y$ belongs to $L^*$ exactly when $\langle y,cz\rangle\in\mathbb Z$ for every $z\in\mathbb Z^n$. Testing the standard basis vectors $z=e_i$ shows that every $cy_i$ must be an integer. Conversely, that coordinate condition makes every such dot product integral. Hence

$$
(c\mathbb Z^n)^*=\frac1c\mathbb Z^n.
$$
