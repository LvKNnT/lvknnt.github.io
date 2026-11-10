---
title: "[CS432] Lattices-Based Cryptography - Chapter 9"
date: 2026-11-03
description: "FrodoKEM noise, matrix-based encryption, and CCA-secure encapsulation"
series: "Lattices-Based Cryptography Course"
seriesOrder: 8
---

# FRODOKEM

These are my notes on Chapter 9 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 9.1 The error distribution
- 9.2 Frodo public-key encryption
- 9.3 FrodoKEM

FrodoKEM uses **ordinary, unstructured LWE** rather than Kyber's module-LWE. This avoids assuming hardness of the additional polynomial structure, while requiring much larger matrices and keys.

## 9.1 The error distribution

FrodoKEM samples small errors from a finite table approximating a **rounded continuous Gaussian**. First, a real Gaussian is rounded to the nearest integer; the probability of an integer $i$ is the area under the Gaussian curve over $[i-\tfrac12,i+\tfrac12]$. The implementation table restricts the support to $[-c,c]$ and scales probabilities to integer weights summing to $2^{16}$.

This rounded distribution differs from a discrete Gaussian, which instead samples integer points with probabilities proportional to the curve's value *at* those points. The PDF presents the Gaussian-like error as a design choice aligned with the form used in LWE hardness work; the asymptotic reduction does not by itself justify concrete FrodoKEM parameters.

## 9.2 Frodo public-key encryption

FrodoPKE uses a public random matrix $A$ over $\mathbb Z_q$ and small secret and error matrices $S,E$:

$$
B=AS+E.
$$

The public key stores a seed from which $A$ can be regenerated plus $B$; the secret key contains $S$. Encryption samples small $R,E_1,E_2$ and forms

$$
U=A^TR+E_1,\qquad V=B^TR+E_2+\operatorname{Encode}(M).
$$

Message encoding places each chunk in one of $2^b$ evenly spaced positions modulo the power-of-two modulus $q$. Decryption computes $V-S^TU$ and decodes each entry. Again the large matrix terms cancel:

$$
V-S^TU=\operatorname{Encode}(M)+E^TR-S^TE_1+E_2.
$$

Decoding succeeds if every entry of that final noise matrix remains within its allowed interval around the encoded value. The chapter analyzes failure probability statistically because a crude worst-case bound is too large. FrodoKEM-640, -976, and -1344 target increasing security levels using correspondingly larger LWE dimensions.

The security discussion uses matrix-LWE variants: multiple related LWE columns are packaged in the public matrix equation. This should not be confused with the polynomial **module** structure of Kyber.

## 9.3 FrodoKEM

FrodoKEM applies a salted Fujisaki-Okamoto-style transform to FrodoPKE. Encapsulation samples a random message $m$ and a fresh salt, hashes them with a digest of the public key to derive encryption randomness and key material, then sends $(U,V,\mathrm{salt})$. The final shared key is hashed from the ciphertext and that material.

Decapsulation decrypts to $m'$, reconstructs the same randomness using the transmitted salt, re-encrypts, and compares the result with $(U,V)$. A match selects the derived key material; a mismatch selects secret fallback material before the final hash. The salt permits fresh randomness even when the same $m$ is used again and is included in the ciphertext so the receiver can reproduce it. The chapter's chosen-ciphertext security claim assumes short-secret decisional Matrix-LWE and a random-oracle model; honest decapsulation failure remains possible with the tiny PKE error probability.

## Exercise

**Adapted from Exercise 9.2.** Let $q$ be divisible by $2^b$, set $D=q/2^b$, and define $\operatorname{Encode}(x)=Dx$ and $\operatorname{Decode}(y)=\lfloor y/D\rceil\bmod 2^b$, with half-integer ties rounded upward. Prove that decoding recovers $x$ when $-D/2\le e<D/2$ is added to its encoding.

## Solution

After scaling, the noisy encoding is

$$
\frac{\operatorname{Encode}(x)+e}{D}=x+\frac eD,
\qquad -\frac12\le\frac eD<\frac12.
$$

Nearest-integer rounding returns $x$ throughout this interval, including the left endpoint because ties round upward. Reduction modulo $2^b$ then returns the original message symbol $x\in\mathbb Z_{2^b}$.
