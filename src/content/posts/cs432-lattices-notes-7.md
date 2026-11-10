---
title: "[CS432] Lattices-Based Cryptography - Chapter 8"
date: 2026-11-03
description: "Falcon, discrete Gaussian sampling, GPV signatures, and NTRU lattices"
series: "Lattices-Based Cryptography Course"
seriesOrder: 7
---

# FALCON (FN-DSA)

These are my notes on Chapter 8 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4). This chapter gives an outline of Falcon and its mathematical ingredients, rather than a complete sampler implementation.

- 8.1 Hash-and-sign
- 8.2 Discrete Gaussian distributions
- 8.3 GPV signature framework
- 8.4 NTRU lattices
- 8.5 NTRU key pair generation
- 8.6 Falcon outline
- 8.7 The Fast Fourier Transform

## 8.1 Hash-and-sign

In a hash-and-sign scheme, hash the message to a target $u$ and use a private trapdoor to find a valid preimage. RSA full-domain hash uses a secret exponent as its trapdoor. The lattice analogue considers $f_A(z)=Az\bmod q$ and asks for a **short** preimage satisfying $Az=u\bmod q$, an inhomogeneous SIS task. A short secret basis for the kernel lattice can make preimage finding possible even when only a long public basis is apparent.

Naively rounding to a nearby lattice point gives a short preimage, but the output distribution can depend on the secret basis. Repeated signatures could then leak it. This motivates randomized preimage sampling.

## 8.2 Discrete Gaussian distributions

For width $s$ and center $c$, the Gaussian weight of a lattice vector $x$ is proportional to $\exp(-\pi\|x-c\|_2^2/s^2)$. Normalizing these weights over $x\in L$ gives the discrete Gaussian $D_{L,s,c}$. Samples favor points near $c$ but do not always select the closest one.

The smoothing parameter $\eta_\varepsilon(L)$ is a width threshold defined using the dual lattice. Above it, a continuous Gaussian reduced modulo $L$ is close to uniform. For GPV, sufficiently wide Gaussian preimage sampling makes signature outputs nearly independent of which short trapdoor basis was used. Width therefore supports both correctness and protection against key leakage.

## 8.3 GPV signature framework

The GPV signer hashes a randomized message to a target in $\mathbb Z_q^n$ and, using a short trapdoor basis, samples a short $z$ from the correct lattice coset so that $Az$ equals that target. Verification checks the modular equation and the norm bound. The security argument relies on the hardness of finding such short preimages without the trapdoor and on the statistical properties of the sampler. Gaussian sampling repairs the distribution weakness of deterministic nearest-plane signing.

## 8.4 NTRU lattices

Falcon uses compact, structured SIS lattices. Let $R_q=\mathbb Z_q[x]/(x^n+1)$, choose short polynomials $f,g$ with $f$ invertible, and publish $h=g/f\in R_q$. The public polynomial $h$ defines a $2n$-dimensional NTRU lattice:

$$
L_h^\perp=\{(z_1,z_2)\in R^2:z_1+hz_2=0\text{ in }R_q\},
\quad R=\mathbb Z[x]/(x^n+1).
$$

Polynomial multiplication corresponds to structured matrices, so $h$ represents the public lattice much more compactly than a general matrix would.

## 8.5 NTRU key pair generation

The secret key includes short $f,g,F,G\in R$ satisfying

$$
fG-gF=q\pmod{x^n+1},\qquad h=g/f\text{ in }R_q.
$$

These relations produce a short basis of the public NTRU lattice. Key generation must ensure invertibility and shortness, not just solve the algebraic equation. The chapter sketches the recursive NTRU-equation method and the basis-quality conditions; its detailed implementation is outside this summary.

## 8.6 Falcon outline

Falcon combines the NTRU trapdoor with discrete Gaussian preimage sampling. It hashes a message plus a fresh randomizer to a polynomial target, samples a short lattice solution with the private basis, and publishes a compact signature. A verifier uses $h$ to check the defining equation and the norm bound. Falcon-512 and Falcon-1024 use $q=12289$ with $n=512$ and $1024$ respectively.

The PDF notes that Falcon's small keys and signatures come with difficult sampling and side-channel engineering. Its version 3.4 does not describe a complete FFT sampler or a fixed-point replacement.

## 8.7 The Fast Fourier Transform

Evaluating a polynomial at the odd complex roots of $x^n+1$ turns polynomial multiplication into componentwise multiplication. The FFT and inverse FFT compute this representation in $O(n\log n)$ time. Falcon also uses this representation to support its Gaussian sampler. Unlike the finite-field NTT of Chapter 13, the FFT operates with approximated real and complex values, so numerical precision and implementation behavior matter.

## Exercise

**Adapted from Exercise 8.7.** If $X$ follows the discrete Gaussian $D_{\mathbb Z,s}$ and $a>0$, show that $aX$ follows $D_{a\mathbb Z,as}$.

## Solution

For any integer $k$, the Gaussian weight of $ak$ at width $as$ is

$$
\exp\!\left(-\pi\frac{(ak)^2}{(as)^2}\right)
=\exp\!\left(-\pi\frac{k^2}{s^2}\right).
$$

Scaling maps $\mathbb Z$ bijectively to $a\mathbb Z$, so the sums of all weights, and hence their normalized probabilities, are the same. Therefore $\Pr[aX=ak]=D_{a\mathbb Z,as}(ak)$ for every $k$.
