---
title: [CS432] Lattices-Based Cryptography - Chapter 6
date: 2026-11-03
description: Kyber encryption, decryption errors, compression, and ML-KEM
series: Lattices-Based Cryptography Course
seriesOrder: 5
---

# KYBER (ML-KEM)

These are my notes on Chapter 6 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 6.1 Kyber public-key encryption
- 6.2 Decryption error probability
- 6.3 Ciphertext compression
- 6.4 Kyber-KEM

## 6.1 Kyber public-key encryption

Kyber extends the Lindner-Peikert construction to polynomial vectors over $R_q=\mathbb Z_q[x]/(x^n+1)$. The standardized key encapsulation mechanism is called ML-KEM. Its underlying public-key encryption (PKE) scheme starts with short polynomial vectors $s,e$ and a public matrix $A$:

$$
t=As+e,\qquad \text{public key }(A,t),\quad\text{secret key }s.
$$

To encrypt an $n$-bit message represented as a polynomial $m$, sample short $r,e_1,e_2$ and compute

$$
u=A^Tr+e_1,\qquad
v=t^Tr+e_2+\lceil q/2\rceil m.
$$

The ciphertext is $(u,v)$. Decryption rounds the coefficients of $v-s^Tu$ back to bits. The large products cancel:

$$
v-s^Tu=\lceil q/2\rceil m+E,\qquad E=e^Tr-s^Te_1+e_2.
$$

Correctness depends on the size of each coefficient of $E$. Security of the uncompressed PKE is argued under short-secret decisional Module-LWE assumptions; this is a separate issue from the probability of a decryption error.

The ML-KEM-512, -768, and -1024 parameter sets all use $q=3329$ and $n=256$, with module rank $k=2,3,4$ respectively. Higher rank increases cost and the intended security level.

## 6.2 Decryption error probability

The coefficients of secret and error polynomials are sampled from centered binomial distributions. One coefficient from $\mathrm{CBD}_\eta$ is the difference of two sums of $\eta$ independent random bits. It has mean zero and variance $\eta/2$.

A worst-case bound on $\|E\|_\infty$ is too pessimistic for the standardized parameters: it assumes every term in every product pushes in the same direction. The chapter instead studies the distribution of sums and uses it to bound the probability that any coefficient crosses a rounding boundary. The probability is tiny, but not literally zero. Compression adds further error and must be included in the final bound.

## 6.3 Ciphertext compression

Kyber transmits compressed coefficients of $u$ and $v$. For a coefficient $X\in\mathbb Z_q$ and a chosen bit width $d$, the source defines

$$
\operatorname{Compress}_q(X,d)=\left\lfloor\frac{2^dX}{q}\right\rceil\bmod 2^d,\qquad
\operatorname{Decompress}_q(Y,d)=\left\lfloor\frac{qY}{2^d}\right\rceil\bmod q,
$$

where $\lfloor\cdot\rceil$ means nearest-integer rounding with the source's tie convention. The map is lossy: the decompressed coefficient differs slightly from the original. This saves ciphertext bytes at the cost of another bounded term in the decryption error. ML-KEM-512 and -768 use $(d_u,d_v)=(10,4)$, while ML-KEM-1024 uses $(11,5)$.

## 6.4 Kyber-KEM

PKE security against chosen plaintexts is not enough for a KEM that must withstand chosen-ciphertext queries. Kyber applies a Fujisaki-Okamoto-style transform. Encapsulation samples a random message $m$, hashes $m$ together with the public key to derive both a candidate shared key and the coins for **deterministic re-encryption**, then sends the PKE ciphertext.

Decapsulation decrypts to $m'$, derives the same coins, and re-encrypts. If the recomputed ciphertext matches, it returns the derived key. Otherwise it derives a fallback key from a secret stored in the decapsulation key and the received ciphertext. The comparison prevents malformed ciphertexts from becoming a useful decryption oracle. Honest decapsulation can still fail with the negligible probability inherited from PKE. The chapter states the KEM security result under short-secret decisional Module-LWE and random-oracle assumptions.

## Exercise

**Adapted from Exercise 6.5.** A compressed Kyber ciphertext contains $k$ polynomials of $n=256$ coefficients at $d_u$ bits each and one polynomial at $d_v$ bits per coefficient. Find its size in bytes for $(k,d_u,d_v)=(2,10,4),(3,10,4),(4,11,5)$.

## Solution

There are $256(kd_u+d_v)$ transmitted bits, so the byte count is $256(kd_u+d_v)/8=32(kd_u+d_v)$. The three cases give $32(24)=768$, $32(34)=1088$, and $32(49)=1568$ bytes, respectively.
