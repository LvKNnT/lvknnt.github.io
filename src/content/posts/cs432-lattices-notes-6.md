---
title: "[CS432] Lattices-Based Cryptography - Chapter 7"
date: 2026-11-03
description: "Dilithium signatures, rejection sampling, and public-key compression"
series: "Lattices-Based Cryptography Course"
seriesOrder: 6
---

# DILITHIUM (ML-DSA)

These are my notes on Chapter 7 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 7.1 Dilithium (toy version)
- 7.2 Dilithium (without $t$ compression)
- 7.3 Dilithium (with $t$ compression)

## 7.1 Dilithium (toy version)

Dilithium, standardized as ML-DSA, is a lattice signature inspired by Schnorr's commit-challenge-response pattern. The signer samples small secrets $s_1,s_2$ and publishes

$$
t=As_1+s_2.
$$

For a message, a fresh masking vector $y$ gives a commitment $w=Ay$. A hash of the message and commitment gives a sparse challenge polynomial $c$; the response is $z=y+cs_1$. Verification cannot simply recover $w$, because

$$
Az-ct=w-cs_2.
$$

The correction $cs_2$ is small. Dilithium hashes only the **high bits** $w_1=\operatorname{HighBits}(w)$ and rejects signing attempts whose low bits are too near a boundary. Then $\operatorname{HighBits}(Az-ct)=w_1$, so the verifier can reconstruct the same challenge.

The toy design reveals five practical issues addressed in the chapter: storing a full public matrix, storing raw private vectors, hashing a long message repeatedly, generating fresh mask randomness on each attempt, and possible leakage of $s_1$ through extreme response coefficients. Public and secret seeds, a prehashed message representative, and a counter-driven mask generator address the first four. **Rejection sampling** keeps $z$ away from ranges where its value would reveal information about $cs_1$.

## 7.2 Dilithium without $t$ compression

Write a coefficient as $r=r_1\alpha+r_0$, where $r_1$ and $r_0$ are its high and centered low parts. These operations extend coefficientwise to polynomial vectors. Signing forms $w_1=\operatorname{HighBits}(Ay,2\gamma_2)$, derives $c$ from the message representative and $w_1$, and computes $z=y+cs_1$.

Two rejection tests are central. The low parts of $w-cs_2$ must be far enough from a boundary that adding $cs_2$ does not change the high parts. Also $\|z\|_\infty<\gamma_1-\beta$, with $\beta=\tau\eta$ when $c$ has $\tau$ nonzero coefficients and the secret bound is $\eta$. The verifier rejects an oversized $z$, reconstructs high bits from $Az-ct$, and recomputes the challenge hash. Small secrets and bounded responses support the MLWE and MSIS-based security arguments.

## 7.3 Dilithium with $t$ compression

The full construction compresses the public vector using

$$
t=2^d t_1+t_0.
$$

Only $t_1$ is published; $t_0$ stays with the signing key. A verifier using $t_1$ sees $Az-c2^dt_1$, which is missing the correction involving $ct_0$. The signer therefore includes a sparse **hint** $h$ telling the verifier how to recover the proper high bits. The signature is a challenge encoding, the response $z$, and $h$.

The signer rejects attempts with an oversized response, unsafe low bits, an overly large $ct_0$, or too many set hint bits. The verifier checks the response and hint bounds, applies the hint to reconstruct the high bits, and checks the challenge hash. The extra hint bytes buy a much smaller public key. The chapter's three parameter sets are ML-DSA-44, -65, and -87.

## Exercise

**Adapted from Exercise 7.1 (one coefficient).** With $\alpha=296$, split $r=4024$ as $r=\alpha r_1+r_0$ using a centered low part $-\alpha/2<r_0\le\alpha/2$. Find its high and low parts.

## Solution

$4024=13(296)+176$, but $176$ lies above $\alpha/2=148$. Replace it by the centered representative $176-296=-120$ and increase the high part by one:

$$
4024=14(296)-120.
$$

Thus $\operatorname{HighBits}(4024,296)=14$ and $\operatorname{LowBits}(4024,296)=-120$.
