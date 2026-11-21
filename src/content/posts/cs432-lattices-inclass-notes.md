---
title: "[CS432] Lattices-Based Cryptography - Inclass Day 1"
date: 2026-11-20
description: "Lattices"
series: "Lattices-Based Cryptography Course - Inclass"
seriesOrder: 1
---

# DAY 1

You can access to the seminar notes [here](https://cryptography101.ca/latticecrypto) so this is just my own notes

- Introduction: pages 1 - 4
- LWE: pages 28 - 32
- Lindner-Peikert encryption: pages 32 - 36.

*Notes* : Each chapter has a "Notes and further references" section and also some exercises. Solutions to computational problems are given in Appendix B. 

# Introduction
In August 2024, The U.S goverment's National Insstitute of Standards and Technology (NIST) published a suite of standards for a key encapsulation mecahnism and for digital signature schemes designed to be resistant to attacks by quantum computers. These quantum-sage schemes are intended t oreplac ewidely deployed RSA and elliptic curve cryptography (ECC), both of which are vulnerable to quantum computing attacks. Although the timeline for the development of cryptographically relevant quantum computers remains uncertain, efforts to transition from RSA and ECC to quantum-safe alternatives are rapidly gaining momentum

Among the quantum-safe cryptographic schemes standardized by NIST, the key encapsulation mechanism Kyber and the digital signature scheme Dilithium are expected to see the broadest deployment in the near future. The security of Kyber relies on the presumed of Dilithium is based on both the MLWE problem and the Module Short Integer Solution (MSIS) problem. These problems are the module variants of the well-studied Learning With Errors (LWE) and Short Integer Solution (SIS) problems, respectively.

These notes give detailed descriptions and analyses of Kyber and Dilithium. We show how the SIS and LWE problems - together with their module variants, MSIS and MLWE - can be cast as computational problems on lattices, justifuing the classification of Kyber and Dilithium as *lattice-based cryptosystems*. We also describe FrodoKEM, a key encapsulation mechanism built on the unstructured LWE problem and standardized by the International Organization for Standardization (ISO), and Falcon, an SIS-based signature scheme over NTRU lattices currently undergoing standardization by NIST

**Organization** The remainder of this document is organized as follows. In $\S 2$, we give an introduction to the theory of lattices and define fundamental computational lattice problems : the Shortest Vector Problem (SVP), the Shortest Independent Vectors Problem (SIVP), the Closest Vector Problem (CVP), and their approximate versions, approx-SVP, approx-SIVP, and approx-CVP. In $\S 3$ and $\S 4$, we show how SIS and LWE can be formulated as lattice problems, and explain their connections to SVP and SIVP. The module variants of SIS and LWE are introduced in $\S 5$. Detailed descriptions of Kyber and Dilithim are provided in $\S 6$ and $\S 7$, Falcon is introduced $\S 8$, and FrodoKEM is described in $\S 9$. The lattice problems SIS, LWE, MSIS, and MLWE can be tackled using the LLL and BKZ lattice basis reduction alforithms described in $\S 10$ and $\S 11$. The performace of LLL and BKZ plays a contral role in assessing the hardness of the lattice problems and in motivating the parameter choices used in Kyber, Dilithium, Falcon and FrodoKEM. Six applications of the LLL algorithm are presented in $\S 12$ : solving short-secret LWE, solving SIS, finding integer relations, performing simultaneous Diophantine approximation, mounting a side-channel attack on the ECSA signature scheme, and finding small roots of univariate polynomials modulo a composite integer with unknown factorization. In $\S 13$, we describe the Number-Theoretic Transform (NNT), a fast algorithm for polynomial multiplication that is essential for efficient implementation of Kyber and Dilithium, and is also employed in Falcon

**Guide to using these notes**. WHile the notes are intended to be introductory, several advanced topics maybe be skipped on a first reading :
- $\S 7.3$ Dilithium (with $t$ compression;) : Understanding Dilithium signature compression requires digesting considerable technocal details, yet yields only a modest decrease in signature size
- $\S 8$ Falcon (FN-DSA) : Although Falcon produces shorter signatures than Dilithium, understanding the scheme and implementing it efficiently and securely pose significant challenges. The initial Falcon proposal used FFT-based floating-point Gaussian sampling, which is difficult to implement safely in constant time. In September 2026, NIST announced plans to use only fixed-point arithmetic in the forthcoming draft standard and to disallow floating point. The present edition of these notes covers neither the FFT-based Gaussian sampling algorithm nor the fixed-point approach
- $\S 10.3.5$ Bit complexity of the LLL algorithm
- $\S 10.4$ LLL improvements
- $\S 11.5$ Sieving : The enumeration algorithm ($\S 11.4$) for solving SVP is conceptually easier to understand and analyze than sieving
- $\S 12.3$ Finding integer relations
- $\S 12.4$ Simultaneous Diophantine approximation
- $\S 12.6$ Finding small roots of a polynomial nodulo $N$
- $\S 13$ The Number-Theoretic Transform : This material is required for a high-performance implementation of Kyber and Dilithium, not for understanding the essential ideas behind the schemes

Readers are encouraged to attempt some of the exercises at the end of each section (without relying on LLMs!). Computational exercises, marked with $\dagger$, can be solved using a computer algebra system such as SageMath, Maple, or Mathematica; answer to these exercise are provided in Appendix B

**Advanced Study**. The research literature on lattices is vast and broad. While these notes offer a solid introduction to lattice-based cryptography, they lack coverage in certain areas, such as worst-case to average-case reductions, security proofs, and protocols with advanced functionalities. There are many possible research directions depending on whether your interests lie in the underlying mathematics, protocol design and analysis, implementation, theory, or applications. Once you have identified a topic that you find especially interesting, you could select a few foundational papers on that topic and read them carefully. For instance, if you are interested in lattice basis reduction, you could read the original LLL paper; if you are interested in KEMs, you could read the paper that first described Kyber. To find topics and papers of interest, you can consult the "Notes and further references" section in each chapter, browse abstracts on the IACR ePrint Archive, or ask your advisor for suggestions. You may find many of the latest research papers difficult to read initially, but as your knowledge grows, grasping their main ideas will beccome much easier

# Learning With Errors (LWE) problem

- 4.1 : Problem Statement
- 4.2 : Lindner-Peikert public-key encryption
- 4.3 : The LWE lattice
- 4.4 : Hardness of LWE
- 4.5 : Notes and further references
- 4.6 : Exercises

The security of a wide range of cryptography protocols, including the Kyber key encapsulation mechaism and the Dilithium signature schem , relies on the hardness of the Learning With Errors (LWE) problem. This section introduces LWE, presents a lattice formulation of LWE, and explores its relationships with SVP and SIVP

## 4.1 Problem statement
The LWE problem was introduced by Oded Regev in 2005. It is parameterized by four values : positive integers $m$ and $n$ with $m \gg n$, a  prome modulus $q$, and a noise bound $B$ satisfying $B \ll q/2$

**Definition 4.1** The *Learning With Errors* problem, denoted $\operatorname{LWE}(m,n,q,B)$, is defined as follows. Choose a matrix $A \in_R \mathbb{Z}_q^{m \times n}$, a secret vectors $s \in_R \mathbb{Z}_q^n$, and an error vector $e \in_R [-B, B]^m$, and let $b = As + e \pmod{q} \in \mathbb{Z}_q^m$. Given the pair $(A, b)$, the goal is to recover $s$. The parameter $m$ is the number of $LWE$ samples.

Oberve that if $B = 0$, so that $e = 0$, then the problem is to solve the system of linear equations $As = b \pmod{q}$ for $s$. In this case, the set of all solutions can be efficiently determined using Gaussian elemination over $\mathbb{Z}_q$. Hardness of LWE arises because of the introduction of the noise $e$. We henceforth assume that $B \neq 0$

**Remark 4.2** *(on the primality of q)*. The requirement that $q$ be prime in Definition 4.1 is a metter of convenicence rather than necessity. Its main effect is that $\mathbb{Z}_q$ is a field, so that $\mathbb{Z}_q^n$ is a vector space and the usual tools of linear algebra are available. For example, a uniformly random matrix $A \in \mathbb{Z}_q^{m \times n}$ with $m \gg n$ has rank $n$ except with negligible probability. As another example, the proof that LWE $\le$ DLWE (Theorem 4.6) relies on the promality of $q$. Similarly, a prime $q$ is preferred in the MLWE setting of Kyber and Dilithium (see $\S 5$), where the known security reductions are established for prime moduli. The requirement is relaxed in $\S 9$, where the FrodoKEM scheme takes $q$ to be a power of two ($2 ^ {15}$ or $2 ^ {16}$), which makes modular reduction particularly efficient

**Remark 4.3** *(distribution choices in LWE)* In Definition 4.1 the secret vector $s$ is sampled uniformly over $\mathbb{Z}_q^n$ and the error vector $e$ uniformly from the range $[-B, B]^m$. More generally , $s$ and $e$ can be sampled from any distribution. For instance, discrete Gaussian distributions are used in numerous cryptographic protocols including the Falcon signature scheme ($\S 8$) and FrodoKEM ($\S 9$), and are central to establishing worst0case to average-case security proof. Alternatively, the centered binomial distribution is employed in Kyber; see $\S 6.2$. Furthermore, each coordinate of $s$ and each coordinate of $e$ can be drawn from the same distribution, as is done in the short-secret variant of LWE (Definition 4.7)

The statement of the LWE problem implicitly assumes that the LWE solution $s$ is unique. In fact, the solution is expected to be unique with overwhelming probability orivded that the number $m$ of rows of $A$ is sufficiently greater than the number of $n$ of columns of $A$. 

To support this claim, observe that multiplying $A$ by vectors $s \in \mathbb{Z}_q^n$ results in a vector $t = AS \pmod{q} \in \mathbb{Z}_q^m$, a vector space with $q^m$ elements. For each $s \in \mathbb{Z}_q^n$, the sphere in $\mathbb{Z}_q^m$ centered at $t = As \pmod{q}$ is defined as $T_s = \{t + e \pmod{q} : e \in [-B, B]^m\}$; note that the number of vectors in each sphere is $|T_s| = (2B + 1)^m$. Uniqueness of the LWE solution is guaranteed if and only if no two off the $q^n$ spheres overlap.

Now, the two spheres centered at $As_1$ and $As_2$ overlap if and only if there exists $e_1, e_2 \in [-B, B]^m$ such that $As_1 + e_1 = As_2 + e_2 \pmod{q}$. Letting $\Delta s = s_1 - s_2$ and $\Delta e = e_2 - e_1$, we see that the LWE solution is not unique if and only if there exist $\Delta s \in \mathbb{Z}_q^n \setminus \{0\}$ and $\Delta e \in [-2B, 2B]^m$ such that $A \Delta s$ is in $[-2B, 2B]^m$ is 
$$
(\frac{4B + 1}{q})^m
$$

By the union bound, the probability that $A \Delta s$ is in $[-2B, 2B]^m$ for at least one nonzero $\Delta s \in \mathbb{Z}_q^n$ is at most 
$$
(q^n - 1)(\frac{4B + 1}{q}^m)
$$

For $B \ll q/2$ and $n \ll m$, this probability is negligible, so the LWE solution is unique with overwhelming probability. In the remainder of these notes, we will assume that the LWE solution is unique

**Example 4.4** (*LWE instance*) Let $m = 5$, $n = 3$, $q = 47$, and $B = 2$. Consider the $\operatorname{LWE}(m,n,q,B)$ instance
$$
A =
\left[
\begin{array}{ccc}
27 & 13 & 13 \\
1 & 46 & 23 \\
16 & 13 & 30 \\
18 & 16 & 19 \\
22 & 0 & 3
\end{array}
\right]
\in \mathbb{Z}_{47}^{5 \times 3},
\qquad
b =
\left[
\begin{array}{c}
30 \\
28 \\
25 \\
34 \\
32
\end{array}
\right]
\in \mathbb{Z}_{47}^{5}.
$$

The LWE challenge is to find $s \in \mathbb{Z}_{47}^{3}$ and
$e \in [-2,2]^5$ such that $As + e = b \pmod{47}$.

It turns out that this LWE instance has three solutions:

$$
\begin{aligned}
s &= (2,15,12), & e &= (1,0,2,0,-1); \\
s &= (19,34,12), & e &= (0,2,0,1,1); \\
s &= (41,33,7), & e &= (1,0,-1,-2,2).
\end{aligned}
$$

**Decisional LWE problem** In the dicisional variant of LWE, the challenge is to distinguish an LWER instance $(A, b)$ from a random instance $(A, r)$ where $r \in \mathbb{Z}_q^m$ is randomly selected. In the latter case, one expects that $As + e = r \pmod{q}$ does not hav ean LWE solution. Essentially, the decisional problem is to decide whether a solution exists.

**Definition 4.5** The *Decisional Learning With Errors* problem $\operatorname{DLWE}(m,n,q,B)$ is the following. Let $A \in_R \mathbb{Z}_q^(m \times n)$, $e \in_R [-B, B]^m$, $r \in_R \mathbb{Z}_q^m$, and let $b = As + e \pmod{q}$. With equal probability $\frac{1}{2}$, set $c = b$ or $c = r$. Given a problem instance $(A, c)$, decide (with success probability significantly greater than $\frac{1}{2}$) whether $c = b$ or $c = r$

**Theorem 4.6** LWE and DLWE ar eccomputationally equivalent
**Proof** : We will first prove that LWE reduces to DLWE (denoted LWE $\le$ DLWE) and then prove that DLWE reduces to LWE (denoted DLWE $\le$ LWE)

(LWE $\le$ DLWE) Let $(A,b)$ be an LWE instance (where $b = As + e$), and assume that we have a DLWE-solver. We will use the solver to test guesses for the coordinates of $s$, one at a time, beginning with the first coordinate $s_1$. This procedure may need to be repeated up to $qn$ times before $s$ is determined 

Let $d \in \mathbb{Z}_q$. To test whether $s_1 = d$, select $\Delta \in_R \mathbb{Z}_q^m$. Let $A'$ be the matrix obtained by adding $\Delta$ to the first column of $A$, and let $b' = b + d \Delta$. 

Now, if $s_1 = d$, dthen $b' = A's + e$ so $(A', b')$ is a valid LWE instance. On the other hand, if $s_1 \neq d$, then $b' = A's + e + (d - s_1) \Delta$. Since $d - s_1$ is nonzero, and $\Delta$ is uniformly random and independent of $A'$, $s$ and $e$, it follows that $b'$ is uniformly random and independent of $A'$. Thus, $(A', b')$ is a valid DLWE instance, whence the DLWE solver with input $(A', b')$ will inform us whether or not $s_1 = d$. We eventually find $s_1$ and the other $s_i$'s similarly.  

(DLWE $\le$ LWE) Let $(A,c)$ be a DLWE insatnce, and assume that we have an LWE-solver. We will use the LWE-solver to efficiently solve the DLWE instance. 

Now, if $c = b$, then $(A,c)$ is an LWE instance and so one expects that $As + e = c \pmod{q}$ has a unique LWE solution $(s, e)$. If $c = r$, as noted earlier, one expects that $As + e = c \pmod{q}$ has no LWE solution $(s, e)$. So, the LWE solver is run with input $(A, c)$. If a valid LWE solution is returned, then we conclude that $c = b$. If the LWE solver terminates without a valid LWE solution, or fails to terminate, then we conclude that $c = r$.

**Short-secret LWE problem** In the short-secret variant of the LWE problem, the coordinates of the secret vectors $s$ are sampled from the same distribution as those of the error vector $e$. 

**Definition 4.7** The *Short-secret Learning With Errors* problem, denoted $\operatorname{ss-LWE}(m,n,q,B)$, is defined as follows. Choose a matrix $A \in_R \mathbb{Z}_q^{m \times n}$, a secret vector $s \in_R [-B, B]^n$, and an error vector $e \in_R [-B, B]^m$, and define $b = As + e \pmod{q} \in \mathbb{Z}_q^m$. Given the pair $(A, b)$, the goal is to recover the secret vector $s$.

Unlike the situation for LWE, the condition $n \ll m$ is no needed to ensure that ss-LWE has a unique solution with high probability.

**Example 4.8** (*ss-LWE instance*) Let $m = 5$, $n = 5$, $q = 97$, and $B = 4$. Consider the $\operatorname{ss-LWE}(m,n,q,B)$ instance

$$
A =
\left[
\begin{array}{ccccc}
15 & 30 & 51 & 23 & 77 \\
6 & 46 & 54 & 84 & 23 \\
32 & 12 & 80 & 78 & 34 \\
32 & 4 & 88 & 18 & 4 \\
52 & 49 & 67 & 31 & 26
\end{array}
\right]
\in \mathbb{Z}_{97}^{5 \times 5},
\qquad
b =
\left[
\begin{array}{c}
34 \\
40 \\
90 \\
85 \\
29
\end{array}
\right]
\in \mathbb{Z}_{97}^{5}.
$$

The ss-LWE challenge is to find $s$ and $e$ in $[-4,4]^5$ such that $As + e = b \pmod{97}$.

It turns out that this ss-LWE instance has a unique solution:

$$
s = (1,-1,0,3,1), \qquad e = (0,-1,-4,-1,4).
$$

**Theorem 4.9** The LWE and ss-LWE problems are computationally equivalent. More precusely, $\operatorname{ss-LWE}(m,n,q,B) \le \operatorname{LWE}(m,n,q,B)$ and $\operatorname{LWE}(m,n,q,B) \le \operatorname{ss-LWE}(m -n,n,q,B)$

**Proof** First consider an instance $(A, b)$ of $\operatorname{ss-LWE}(m,n,q,B)$, where $b = As + e \pmod{q}$ with $s \in_R [-B, B]^n$ and $e \in_R [-B,B]^m$. Select a random vector $d \in_R \mathbb{Z}_q^n$ and define 
$$
b' = b + Ad = (As + e) + Ad = A(s + d) + e \pmod{q}
$$

Then $(A', b)$ forms an $\operatorname{LWE}(m,n,q,B)$ instance. If $(s', e)$ is a solution to this LWE instance, then $(s' - d, e)$ is immediately a solution to the instance ss-LWE instance. This establishes that $\operatorname{ss-LWE}(m,n,q,B) \le \operatorname{LWE}(m,n,q,B)$

Now suppose $(A, b)$ is an $\operatorname{LWE}(m,n,q,B)$ instance, so that $b = As + e \pmod{q}$. Partition the matrix $A$ and vectors $b$ and $e$ as 
$$
A =
\left[
\begin{array}{c}
A_1 \\
A_2
\end{array}
\right],
\quad
b =
\left[
\begin{array}{c}
b_1 \\
b_2
\end{array}
\right],
\quad
e =
\left[
\begin{array}{c}
e_1 \\
e_2
\end{array}
\right],
$$

where $A_1 \in \mathbb{Z}_q^{n \times n}, A_2 \in \mathbb{Z}_q^{(m - n) \times n}, b_1 \in \mathbb{Z}_q^n, e_1 \in [-B, B]^n, b_2 \in \mathbb{Z}_q^{m - n}$, and $e_2 \in [-B, B]^{m - n }$. Assuming $A_1$ is invertible modulo $q$, define 
$$
A' = -A_2 A_1 ^{-1} \in \mathbb{Z}_q^{(m - n) \times n} \text{ and } b' = A'b_1 + b_2 \in \mathbb{Z}_q^{m - n}
$$

Then
$$
\begin{aligned}
b' &= A'b_1 + b_2 \\
   &= (-A_2 A_1^{-1})(A_1 s + e_1) + (A_2 s + e_2) \\
   &= -A_2 s - A_2 A_1^{-1} e_1 + A_2 s + e_2 \\
   &= A'e_1 + e_2.
\end{aligned}
$$

Therefore, $(A', b')$ forms an $\operatorname{ss-LWE}(m - n, n, q, B)$ instance. Solving this ss-LWE instance yields $e_1$, from which the original secret $s$ can be immediately recovered, thereby solving the original LWE instance. Hence, $\operatorname{LWE}(m,n,q,B) \le \operatorname{ss-LWE}(m-n,n,q,B)$

