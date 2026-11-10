---
title: [CS432] Lattices-Based Cryptography - Chapter 13
date: 2026-11-03
description: Fast polynomial multiplication with Dilithium and Kyber NTT variants
series: Lattices-Based Cryptography Course
seriesOrder: 12
---

# THE NUMBER-THEORETIC TRANSFORM

These are my notes on Chapter 13 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 13.1 NTT definition
- 13.2 NTT computation
- 13.3 Dilithium NTT
- 13.4 Kyber NTT

## 13.1 NTT definition

Multiplying two degree-below-$n$ polynomials directly takes $O(n^2)$ coefficient operations. The **Number-Theoretic Transform** (NTT) makes multiplication in $R_q=\mathbb Z_q[x]/(x^n+1)$ take $O(n\log n)$ operations by moving to an evaluation representation.

Assume $n$ is a power of two and $2n$ divides $q-1$. Then $\mathbb Z_q$ contains an element $\zeta$ of order $2n$, with $\zeta^n=-1$. The odd powers $\zeta,\zeta^3,\ldots,\zeta^{2n-1}$ are the roots of $x^n+1$. Define

$$
\operatorname{NTT}(a)=
\bigl(a(\zeta),a(\zeta^3),\ldots,a(\zeta^{2n-1})\bigr).
$$

The transform is invertible. Evaluation turns addition into componentwise addition and multiplication modulo $x^n+1$ into componentwise multiplication:

$$
ab=\operatorname{NTT}^{-1}\!\bigl(\operatorname{NTT}(a)\circ\operatorname{NTT}(b)\bigr).
$$

This is the finite-field counterpart of Fourier multiplication, with exact modular arithmetic instead of approximated complex arithmetic.

## 13.2 NTT computation

The fast transform exploits the factorization of $x^n+1$ into progressively smaller factors. For $n=8$, split into degree-four factors, then degree-two factors, then linear factors at the odd powers of $\zeta$. Each level uses butterfly updates that combine two pieces by a sum and a difference, with a prescribed power of $\zeta$ multiplying one piece.

There are $\log_2 n$ levels and $O(n)$ work per level, hence $O(n\log n)$ for both forward and inverse transforms. The inverse also applies the appropriate normalization. Keeping the transformed ordering consistent is essential: a correct set of evaluations in the wrong order gives incorrect pointwise products.

## 13.3 Dilithium NTT

Dilithium has $n=256$ and $q=8380417$, for which $2n$ divides $q-1$. It therefore uses a full transform into 256 field values. Its specified output orders the odd roots by **bit reversal**, matching the leaves of the in-place butterfly computation rather than sorting the roots numerically.

During matrix-vector products, the public matrix can be generated directly in NTT form. Transform each short secret polynomial once, perform many cheap componentwise products and additions, then apply inverse transforms only to the output components that need coefficient form. This is why the NTT matters across key generation, signing, and verification, not just in a standalone multiplication.

## 13.4 Kyber NTT

Kyber uses $n=256$ but $q=3329$, and $q-1=3328$ is divisible by $n$ **without** being divisible by $2n$. There is no full set of roots needed for the preceding transform. Instead, the final factorization stops at degree two.

Kyber's quadratic transform $\operatorname{NTT}_2$ maps a polynomial to its remainders modulo $x^2-\zeta^i$ for the relevant odd powers of an order-$n$ element $\zeta$. Each output component is a pair of coefficients, and multiplication is performed inside its corresponding quadratic ring. The transform and inverse remain $O(n\log n)$; the final componentwise work is multiplication of quadratic residues rather than individual field values. Kyber also uses bit-reversed ordering so the representation matches its butterfly layout.

## Exercise

**Adapted from Exercise 13.2(b).** In $R_{97}=\mathbb Z_{97}[x]/(x^4+1)$, use the order-eight root $\zeta=64$ to multiply $a=1+71x+52x^2+90x^3$ and $b=83+31x+13x^2+54x^3$ by the NTT.

## Solution

The four evaluation points $\zeta,\zeta^3,\zeta^5,\zeta^7$ are $(64,50,33,47)$ modulo $97$. Evaluating gives

$$
\widehat a=(4,19,55,23),\qquad
\widehat b=(9,50,50,29).
$$

Multiply corresponding entries modulo $97$:

$$
\widehat c=\widehat a\circ\widehat b
=(36,77,34,85).
$$

The inverse NTT of this vector is $c=58+6x+21x^2+68x^3$. As a check, evaluating this $c$ at the four roots gives $(36,77,34,85)$; invertibility of the NTT makes it the unique product in $R_{97}$.
