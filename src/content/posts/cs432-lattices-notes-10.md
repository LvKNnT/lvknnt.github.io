---
title: "[CS432] Lattices-Based Cryptography - Chapter 11"
date: 2026-11-03
description: "BKZ blocks, enumeration, sieving, and lattice security estimates"
series: "Lattices-Based Cryptography Course"
seriesOrder: 10
---

# THE BKZ LATTICE BASIS REDUCTION ALGORITHM

These are my notes on Chapter 11 of [A Gentle Introduction to Lattice-Based Cryptography](https://cryptography101.ca/latticecrypto) (version 3.4).

- 11.1 BKZ-reduced bases
- 11.2 Algorithm description
- 11.3 Complexity analysis
- 11.4 Enumeration
- 11.5 Sieving
- 11.6 Estimating the security level of Kyber
- 11.7 Estimating the security level of Falcon

## 11.1 BKZ-reduced bases

**Block Korkine-Zolotarev** (BKZ) replaces LLL's two-vector local view with projected blocks of size at most $\beta$. For a basis $B=[b_1,\ldots,b_n]$, project the vectors $b_i,\ldots,b_j$ orthogonally away from the span of $b_1,\ldots,b_{i-1}$. The resulting lattice $L[i,j]$ is the local block.

A $\beta$-BKZ-reduced basis is size-reduced and has each $b_i^*$ as a shortest nonzero vector of the corresponding projected block $L[i,\min(i+\beta-1,n)]$. At $\beta=2$, the condition matches the strongest two-dimensional LLL-style local reduction; at $\beta=n$, the first basis vector solves SVP for the full lattice. Larger $\beta$ generally improves the basis but makes each block operation harder.

## 11.2 Algorithm description

BKZ starts from an LLL-reduced basis and performs repeated **tours** through overlapping blocks. Within a block, an SVP subroutine finds a short projected vector. The algorithm lifts it to the original lattice, inserts it into the basis, and restores a valid reduced basis. It stops when a tour makes no further change in the idealized description.

Practical implementations use stopping rules because a useful polynomial bound on the number of tours is not known. They often stop when additional tours provide too little improvement.

## 11.3 Complexity analysis

The blocksize is the main cost knob. Each SVP call is exponential in $\beta$, while the number and management of blocks depend polynomially on the ambient dimension in a simplified cost model. The chapter describes the runtime roughly as $2^{c\beta}\operatorname{poly}(n)$ for some model-dependent $c>0$, assuming suitable early stopping. Such estimates are not exact performance guarantees; the SVP method, memory budget, and stopping strategy matter.

## 11.4 Enumeration

Enumeration searches combinations of basis vectors for one whose Euclidean length is below a bound $D$. A Gram-Schmidt basis lets the search bound partial sums and prune whole branches of a depth-first tree. It uses relatively little memory but becomes very costly as block dimension grows. Starting with LLL makes the search more manageable by providing a better basis and an initial short vector.

## 11.5 Sieving

Sieving starts from many lattice vectors and repeatedly combines nearby vectors to produce shorter ones. The Nguyen-Vidick-style sieve in the PDF keeps large lists of vectors, shrinks their typical length over rounds, and expects the last nonempty list to contain vectors near $\lambda_1(L)$. This trades substantial memory for an exponential-time method with a different cost profile from enumeration.

## 11.6 Estimating the security level of Kyber

For Kyber, the chapter models recovering its short secret as a short-secret LWE problem of matching coefficient dimensions. A primal attack builds a lattice containing $(e,s,1)$ as an unusually short vector. BKZ succeeds when its reduction quality is sufficient to expose that vector; the minimum estimated blocksize and the cost of the corresponding SVP calls give a security estimate. This is an attack-cost model, relying on assumptions such as the geometric series behavior of Gram-Schmidt lengths, not a direct proof that every attack costs that much.

## 11.7 Estimating the security level of Falcon

Falcon key recovery looks for short $(f,g)$ satisfying the NTRU public-key equation. The private vector is much shorter than the Gaussian heuristic predicts for a generic vector in the public lattice, so it can be modeled as a unique-SVP target. Signature forgery instead seeks a sufficiently short preimage for a chosen target. The chapter estimates the BKZ blocksize needed for each route; both estimates depend on heuristic reduction and SVP cost models.

## Exercise

**Adapted from Exercise 11.4.** Let $L$ have basis $b_1=(2,0)$ and $b_2=(1,2)$. Check that it is LLL-reduced for $\delta=3/4$, find the enumeration bound $D=\min(\|b_1\|,\sqrt2\,\operatorname{vol}(L)^{1/2})$, and find all shortest nonzero lattice vectors.

## Solution

$b_1^*=(2,0)$ and $\mu_{21}=\langle b_2,b_1\rangle/\|b_1\|^2=1/2$, so $b_2^*=b_2-\tfrac12b_1=(0,2)$. The basis is size-reduced, and the Lovász test is $4\ge(3/4-1/4)4=2$. Its volume is $|\det[b_1\ b_2]|=4$, so $D=\min(2,\sqrt2\sqrt4)=2$.

Every lattice vector is $(2a+b,2b)$ for integers $a,b$. If $b=0$, the shortest nonzero choices are $(\pm2,0)$ of length $2$. If $b$ is odd, the squared length is at least $1+4=5$; if $b$ is nonzero and even, its second coordinate has magnitude at least $4$. Therefore $\lambda_1(L)=2$ and the only shortest nonzero vectors are $(2,0)$ and $(-2,0)$.
