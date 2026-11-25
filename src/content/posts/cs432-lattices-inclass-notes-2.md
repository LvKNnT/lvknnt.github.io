---
title: "[CS432] Lattices-Based Cryptography - Inclass Day 2"
date: 2026-11-23
description: "Polynomial rings - MLWE - Kyber PKE"
series: "Lattices-Based Cryptography Course - Inclass"
seriesOrder: 2
---

# DAY 2

Here is the Vietnamese translation of the ISO standard on Kyber-KEM: [https://cryptography101.ca/wp-content/uploads/16_10_Du-thao-TCVN-ML-KEM-copy.pdf](https://cryptography101.ca/wp-content/uploads/16_10_Du-thao-TCVN-ML-KEM-copy.pdf)

You can access to the seminar notes [here](https://cryptography101.ca/latticecrypto) so this is just my own notes


- Polynomial rings : Section 5.1.
- MLWE : Section 5.3.
- Kyber PKE : Section 6.1.

*Notes* : Kyber-KEM is covered in Section 6.4. 

# Polynomial rings

## 5 Modulo-SIS and Module-LWE

---
- 5.1 The polynomial ring $R_q = \mathbb{Z}_q[x] / (x ^ n + 1)$
- 5.2 Module-SIS (MSIS)
- 5.3 Module-LWE (MLWE) 
- 5.4 Notes and further references
- 5.5 Exercises
---

The security of Kyber relies on the assumed hardness of the module version of the LWE problem, whereas Dilithium's security relies on the module versions of both the SIS and LWE problems. These variants are derived from SIS and LWE by replacing integers modulo $q$ with elements of the polynomial ring $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$

## 5.1 The polynomial ring $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$

Let $q$ be a prime and $n$ a positive integer. The *polynomial ring* $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$ is composed of the polynomials in $\mathbb{Z}_q [x]$ of degree less than $n$, with multiplication performed using the *reduction polynomial* $x ^ n + 1$

To multiply two polynomials $f(x), g(x) \in R_q$, one (i) multiplies them using ordinary polynomial multiplication in $\mathbb{Z}_q[x]$ to obtain a polynomial $h(x) \in \mathbb{Z}_q [x]$ of degree at most $2n - 2$; and then (ii) devides $h(x)$ by $x ^ n +1$ to get a remainder polynomial $r(x) \in \mathbb{Z}_q[x]$ of degree at most $n - 1$. The product of $f(x)$ and $g(x)$ in $R_q$ is the remainder polynomial $r(x)$

**Example 5.1** (*polynomial ring*) Let $q = 43$ and $n = 4$. Then $R_q = \mathbb{Z}_{43}[x]/(x^4+1)$ is composed of the polynomials in $\mathbb{Z}_{43}[x]$ of degree at most 3.

Let $f(x) = 33 + 41x + 12x^3 \in R_q$ and $g(x) = 2 + 17x + 39x^2 + 14x^3 \in R_q$. Then their sum and difference in $R_q$ are

$$
f(x) + g(x) = 35 + 15x + 39x^2 + 26x^3
$$

and

$$
f(x) - g(x) = 31 + 24x + 4x^2 + 41x^3.
$$

The product of $f$ and $g$ in $\mathbb{Z}_{43}[x]$ is the degree-6 polynomial

$$
h(x) = 23 + 41x + 6x^2 + 21x^3 + 4x^4 + 38x^5 + 39x^6.
$$

The division of $h(x)$ by $x^4+1$ can be accomplished by replacing $x^4$ by $-1$, $x^5$ by $-x$, and $x^6$ by $-x^2$, and then simplifying. We obtain

$$
r(x) = 23 + 41x + 6x^2 + 21x^3 - 4 - 38x - 39x^2 = 19 + 3x + 10x^2 + 21x^3.
$$

Thus, the product of $f$ and $g$ in $R_q$ is

$$
f(x) \times g(x) = r(x) = 19 + 3x + 10x^2 + 21x^3.
$$

In $\S 13$, we will describe the Number-Theoretic Transform (NTT), a very fast method for performing polynomial multiplication in $R_q$

**Polynomial as vectors.** Let $R_q = \mathbb{Z}_q[x] / (x ^ n + 1)$. A polynomial $f(x) = a_0 + a_1 x + \dots + a_{n-1} x^{n-1} \in R_q$ can be represented by its length-$n$ vector of coefficients $f = (a_0, a_1, \dots, a_{n-1})$


**Example 5.2** (*representing polynomials as vectors*) Let $q = 31$ and $n = 5$, so $R_q = \mathbb{Z}_{31}[x]/(x^5+1)$. Let $f(x) = 12 + 3x + 4x^3 + 30x^4 \in R_q$ and $g(x) = 7 + 13x + 22x^2 + 27x^3 + 28x^4 \in R_q$. The vector representations of $f(x)$ and $g(x)$ are

$$
f = (12,3,0,4,30) \quad \text{and} \quad g = (7,13,22,27,28).
$$

One can verify that the vector representations of the sum, difference, and product of $f(x)$ and $g(x)$ in $R_q$ are

$$
f+g = (19,16,22,0,27), \\
f-g = (5,21,9,8,2), \\
\text{and} \quad f \times g = (18,29,1,12,28).
$$

**Polynomial multiplication via matrices**. Polynomial multiplication in $R_q$ can be epressed as a matrix-vector product. Let $a(x) = a_0 + a_1 x + \dots + a_{n-1} x ^ {n-1} \in R_q$ and $b(x) = b_0 + b_1 x + \dots + b_{n-1} x ^ {n-1} \in R_q$, and let $c(x) = a(x) \times b(x)$ in $R_q$. Then 
$$
\begin{align}
c(x) 
& = a(x) (b_0 + b_1 x + \dots b_{n-1} x ^ {n - 1}) \\
& = b_0 \cdot a(x) + b_1 x \cdot a(x) + \dots + b_{n-1} x^{n-1} \cdot a(x)
\end{align}

\tag{17}\label{poly multiplication}
$$

Now,
$$
\begin{align}
x \cdot a(x) 
& = a_0 x + a_1 x ^ 2 + \dots a_{n-1} x ^ {n} \\ 
& = -a_{n-1} + a_0 x + \dots + a_{n-2} x ^ {n-1} \pmod{x ^ n + 1} \\ 
& \leftrightarrow (-a_{n-1}, a_0, \dots, a_{n-2})
\end{align}
$$

since $x ^ n = -1 \pmod{x ^ n + 1}$. Thus, the vector representation of $x \cdot a(x)$ is the right cyclic shift of the vector representation of $a(x)$, with the cycled element negated. It follows from $\eqref{poly multiplication}$ that if $c(x) = a(x) \times b(x)$ in $R_q$, then

$$
\underbrace{
\left[
\begin{array}{c}
c_0 \\
c_1 \\
c_2 \\
\vdots \\
c_{n-1}
\end{array}
\right]
}_{c}
=
\underbrace{
\left[
\begin{array}{ccccc}
a_0 & -a_{n-1} & -a_{n-2} & \cdots & -a_1 \\
a_1 & a_0 & -a_{n-1} & \cdots & -a_2 \\
a_2 & a_1 & a_0 & \cdots & -a_3 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
a_{n-1} & a_{n-2} & a_{n-3} & \cdots & a_0
\end{array}
\right]
}_{\mathcal{A}(a)}
\underbrace{
\left[
\begin{array}{c}
b_0 \\
b_1 \\
b_2 \\
\vdots \\
b_{n-1}
\end{array}
\right]
}_{b}.
$$

The $n \times n$ matrix above is an *anti-circulant matrix*, denoted $A = \mathbb{A}(a)$ or $A = \overline{\operatorname{circ}}(a)$.


**Example 5.3** (*matrix representation of $R_q$ multiplication*) Let $q = 17$ and $n = 5$, so $R_q = \mathbb{Z}_{17}[x]/(x^5+1)$. Let $a(x) = 11 + 2x + 9x^3 + 13x^4$, $b(x) = 5 + 3x + 14x^2 + 7x^3 + 15x^4 \in R_q$.

Then the vector representation of $c(x) = a(x)b(x)$ is

$$
c =
\underbrace{
\left[
\begin{array}{ccccc}
11 & 4 & 8 & 0 & 15 \\
2 & 11 & 4 & 8 & 0 \\
0 & 2 & 11 & 4 & 8 \\
9 & 0 & 2 & 11 & 4 \\
13 & 9 & 0 & 2 & 11
\end{array}
\right]
}_{\mathcal{A}(a)}
\underbrace{
\left[
\begin{array}{c}
5 \\
3 \\
14 \\
7 \\
15
\end{array}
\right]
}_{b}
=
\left[
\begin{array}{c}
13 \\
2 \\
2 \\
6 \\
16
\end{array}
\right].
$$

Hence, $a(x)b(x) = 13 + 2x + 2x^2 + 6x^3 + 16x^4$ in $R_q$.

We next define a notion of "size" for integers in $\mathbb{Z}_q$ and polynomials in $R_q$

**Definition 5.4** Let $q \ge 3$ be an odd integer. The *size* os an integer $r \in \mathbb{Z}_q$, also called the *infinity norm of r*, is $|| r ||_\infty = |r \operatorname{mods} q$ where $| \cdots |$ denotes absolute value.

Note that $0 \le ||r||_\infty \le (q - 1) / 2$. For example, if $q = 17$ then $0 \le || r ||_\infty \le 8$. We have $|| 6 ||_\infty = 6$ and $|| 13 ||_\infty = 4$

**Definition 5.5** The *size* of a polynomial $f(x) = f_0 + f_1 x + \dots + f_{n_1} x ^ {n-1} \in R_q$ is $|| f || _\infty = \max_i ||f_i|| _\infty$ also called the *infinity norm* of $f(x)$

**Definition 5.6** Let $\eta$ be an positive integer that is small compared to $q / 2$. The set of *small polynomials* in $R_q$ is $S_\eta = \{f \in R_q \mid ||f ||_\infty \le \eta \}$.

The product of small polynomials is also (relatively) small, as shown next

**Theorem 5.7** Fix $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$. Let $\eta_1$ and $\eta_2$ be positive integers such that $\eta \eta_1 \eta_2 < q/2$. Let $f \in S_{\eta_1}$ and $g \in S_{\eta_2}$. Then $fg \in S_{\eta \eta_1 \eta)2}$

**Proof:** Consider $f(x) = f_0 + f_1 x + \dots + f_{n-1} x ^ {n-1} \in S_{\eta_1}$ and $g(x) = g_0 + g_1 x + \dots + g_{n-1} x^{n-1} \in S_{\eta_2}$. Let $h(x) = h_0 + h_1 x + \dots + h_{n-1} x^{n-1}$ be the product of $f(x)$ and $g(x)$ in $R_q$. By multiplying $f(x)$ and $g(x)$, then replacing $x ^ {n + j} by $-x^j$ for $0 \le j \le n-2$, and then simplifying, one can observe that the coefficient $h_i$ of $x ^ i$ in $h(x)$ for each $i \in [0, n-1]$ is :
$$
\begin{align}
h_i = 
& f_0 g_i + f_1 g{i-1} + \dots + f_i g_0 - f_{i+1} g_{n-1} \\
& - f_{i+2} g_{n-2} - \dots - f_{n-2} g_{i+2} - f_{n-1} g_{i+1}
\end{align}
$$

Hence, $||h_i||_\infty \le \eta \eta_1 \eta_2$, whence $|| h||_\infty \le \eta \eta_1 \eta_2$


**Example 5.8** (*small polynomials*) Let $q = 379$ and $n = 5$, so $R_q = \mathbb{Z}_{379}[x]/(x^5+1)$.

Let $f(x) = 378 + x^2 + 2x^3 + 377x^4 \in R_q$. The mods $q$ representation of $f$ is $f(x) = -1 + x^2 + 2x^3 - 2x^4$ so $f \in S_2$ is a small polynomial (with respect to $\eta_1 = 2$).

Similarly, let $g(x) = 3 + 376x + 2x^2 + 378x^3 + 377x^4 \in S_3$ be a small polynomial (with respect to $\eta_2 = 3$).

Then the product of $f$ and $g$ in $R_q$ is $h(x) = 367 + 11x + 3x^2 + 371x^4$ which is in $S_{12}$ since its mods $q$ representation is $h(x) = -12 + 11x + 3x^2 - 8x^4$.

Note $12 \leq n\eta_1\eta_2 = 30 < q/2$.

# MLWE

## 5.3 Module-LWE (MLWE)
MLWE is a variant of LWE in which integers modulo $q$ are replaced by polynomials in the ring $R_q = \mathbb{Z}_q [x] / (x^n + 1)$

**Definition 5.14** The *Module Learning With Errors* problem $\operatorname{MLWE}(k, \ell, n, q, \eta)$ is the following. Let $A \in_R R_q^{k \times \ell}, s \in_R R_q^\ell$ and $e \in_R S_\eta^k$. Here, $k > \ell, \eta \ll q/2$, and $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$. Given $A$ and $t = As + e \in R_q^k$, find $s$

The columns $A_1, A_2, \dots, A_\ell$ of $$A belongs to the module $R_q^k$. MLWE asks to express the module element $t$, up to a small error $e$, as a linear combination of the $A_i$, where the coefficients of the linear combination are polynomials.


**Example 5.15** (*MLWE instance*) Let $k = 3$, $\ell = 2$, $n = 4$, $q = 37$ (so $R_q = \mathbb{Z}_{37}[x]/(x^4+1)$), and $\eta = 1$. Randomly select

$$
A =
\left[
\begin{array}{cc}
33 + 34x^2 + 8x^3 & 21 + 10x + 19x^2 + 18x^3 \\
3 + 13x + 19x^2 + 18x^3 & 34 + 19x + 15x^2 + 4x^3 \\
16 + 6x + 5x^2 + 7x^3 & 24 + 6x + 35x^2 + 31x^3
\end{array}
\right]
\in R_q^{3 \times 2},
$$

$$
s =
\left[
\begin{array}{c}
32 + 15x + 16x^2 + 3x^3 \\
10 + 28x + 6x^2 + 2x^3
\end{array}
\right]
\in R_q^2,
\quad
\text{and} \quad
e =
\left[
\begin{array}{c}
1-x \\
1-x^2-x^3 \\
-1+x-x^3
\end{array}
\right]
\in S_1^3,
$$

and define $t$ to be

$$
t = As + e =
\left[
\begin{array}{c}
2 + 29x + 6x^2 + 14x^3 \\
28 + 20x + 9x^2 + 17x^3 \\
13 + 5x + 12x^2 + 3x^3
\end{array}
\right]
\in R_q^3.
$$

Given $(A,t)$, the MLWE challenge is to find $s \in R_q^2$ and $e \in S_1^3$ such that $As + e = t$.


Recall that polynomial multiplication in $R_q$ can be expressed as a matrix-vector product. Consequently, an equivalent formulation of this MLWE instance is to solve $\overline{A}\,\overline{s} + \overline{e} = \overline{t}$ (mod $37$) for $\overline{s} \in \mathbb{Z}_{37}^{8}$ and $\overline{e} \in [-1,1]^{12}$, where

$$
\overline{A} =
\left[
\begin{array}{cccc|cccc}
33 & 29 & 3 & 0 & 21 & 19 & 18 & 27 \\
0 & 33 & 29 & 3 & 10 & 21 & 19 & 18 \\
34 & 0 & 33 & 29 & 19 & 10 & 21 & 19 \\
8 & 34 & 0 & 33 & 18 & 19 & 10 & 21 \\
\hline
3 & 19 & 18 & 24 & 34 & 33 & 22 & 18 \\
13 & 3 & 19 & 18 & 19 & 34 & 33 & 22 \\
19 & 13 & 3 & 19 & 15 & 19 & 34 & 33 \\
18 & 19 & 13 & 3 & 4 & 15 & 19 & 34 \\
\hline
16 & 30 & 32 & 31 & 24 & 6 & 2 & 31 \\
6 & 16 & 30 & 32 & 6 & 24 & 6 & 2 \\
5 & 6 & 16 & 30 & 35 & 6 & 24 & 6 \\
7 & 5 & 6 & 16 & 31 & 35 & 6 & 24
\end{array}
\right]_{12 \times 8}
\quad \text{and} \quad
\overline{t} =
\left[
\begin{array}{c}
2 \\
29 \\
6 \\
14 \\
\hline
28 \\
20 \\
9 \\
17 \\
\hline
13 \\
5 \\
12 \\
3
\end{array}
\right]_{12 \times 1}.
$$

The $4 \times 4$ blocks in $\overline{A}$ are the anti-circulant matrices corresponding to the polynomials in $A$, whereas the $4 \times 1$ blocks in $\overline{t}$ are the vector representations of the polynomials in $t$.

As it turns out, there are two MLWE solutions:

$$
\overline{s} = (17,4,36,30,35,31,13,12),
\quad
\overline{e} = (-1,0,1,0,-1,-1,1,0,0,-1,-1,-1);
$$
and
$$
\overline{s} = (32,15,16,3,10,28,6,2),
\quad
\overline{e} = (1,-1,0,0,1,0,-1,-1,-1,1,0,-1).
$$

The polynomial form of the first solution is $s = (17 + 4x + 36x^2 + 30x^3,\ 35 + 31x + 13x^2 + 12x^3)$, $e = (-1 + x^2,\ -1 - x + x^2,\ -x - x^2 - x^3)$. The second solution is the $(s,e)$ pair that was used to construct this MLWE instance.

The decisional variant D-MLWE of MLWE is defined next. Analogously to Theorem 4.6, one can show that MLWE and D-MLWE are compuationally equivalent (Exercise 5.7)

**Definition 5.6** The *Decisional Module Learning With Errors* problem $\operatorname{D-MLWE}(k,\ell,n,q,\eta)$ is the following. Let $A \in_R R_q^{k \times \ell}, e \in_R S_\eta^k, e \in_R R_q^\ell, r \in R_q^k$, and let $t = As + e \in R_q^k$. Let $z = t$ with the probability $\frac{1}{2}$ and $z = r$ with probability $\frac{1}{2}$. Given $A$ and $z$, decide (with the success probability significantly greater than $\frac{1}{2}$) whether $z = t$ or $z = r$.

In the short-secret variants of MLWE and D-MLWE , the secret polynomial vector $s$ is required to have small coefficients. Each of these variants is equivalent to MLWE (Exercises 5.8 and 5.9)

**Definition 5.17** The *short-secret Module Learning With Errors* problem $\operatorname{ss-MLWE}(k,\ell,n,q,\eta_1,\eta_2)$ is the following. Let $A \in_R R_q^{k \times \ell}, s \in_R S_{\eta_1}^\ell$ and $e \in_R S_{\eta_2}^k$. Here, $k \ge \ell$ and $\eta_1, \eta_2 \ll q/2$. Given $A$ and $t = As + e \in R_q^k$, find $s$

**Definition 5.18** The *short-secret DEcisional Module Learning With Errors* problem $\operatorname{ss-D-LWE}(k,\ell,n,q,\eta_1,\eta_2)$ is the following. Let $A \in_R R_q^{k \times \ell}, s \in_R S_\eta^\ell, e \in_R S_{\eta_1}^\ell, e \in_R S_{\eta_2}^k, r \in_R R_q^k$, and let $t = As + e \in R_q^k$. Let $z = t$ with the probability $\frac{1}{2}$ and $z = r$ with the probability $\frac{1}{2}$. Here, $k \ge \ell$ and $\eta_1, \eta_2 \ll q/2$. Given $A$ and $z$, decide (with the success probability significantly greater than $\frac{1}{2}$) whether $z = t$ and $z = r$

# Kyber PKE
## 6 Kyber (ML-KEM)

- 6.1 : Kyber public-key encryption
- 6.2 : Decryption error probability
- 6.3 : Ciphertext compression
- 6.4 : Kyber-KEM
- 6.5 : Notes and further references
- 6.6 : Exercises

Kyber-KEM is a quantum-safe key encapsulation mechaism (KEM) standardized by NIST in FIPS 203, where its official name is Module-Lattice-based KEM (ML-KEM). It is designed to offer strong security guarantees against attacks from both classical and quantum computers. Kyber-KEM is based on the Kyber public-key encryption scheme (Kyber-PKE), described next

## 6.1 Kyber public-key encryption
The Kyber public-key encryption scheme can be viewed as a naturaal extension of the Lindner-Peikert scheme described in $\S 4.2$, with the elements in $\mathbb{Z}_q$ replaced by polynomials in the ring $R_q = \mathbb{Z}_q [x] / (x ^ n + 1)$

**Notation**. Recall that $S_\eta = \{f \in R_q \mid ||f||_\infty \le \eta\}$, and that $\lceil x \rfloor$ denotes the nearest integer to $x$ with ties broken upward. The plaintext space is $\{0, 1\}^n$. A plaintext $m = \{m_0, m_1, \dots, m_{n-1}\} \in \{0, 1\} ^ n$ is associated with the polynomial $m(x) = m_0 + m_1 x + \dots + m_{n-1} x^{n-1} \in R_q$. The rounding function $\operatorname{Round}_q$ (Definition 4.12) extends naturally to polynomials in $R_q$ by applying it coefficientwise. For instance, if $q = 3329$ then $\operatorname{Round}_q(100 + 1000x + 2000x^2 + 3000x^3) = x + x^2$

The Kyber public-key encryption scheme without ciphertext compresison is described in Algorithm 6.1. The standardized version, which incorporates ciphertext compression is presented in $\S 6.3$. The three Kyber parameter sets specified in FIPS 203 are listed in Table 6.1. Their intended security levels against classical attacks approximately 128, 192 and 256 bits


**Example 6.2** (*Kyber-PKE*)

**Domain Parameters.** $q = 991$, $n = 3$, $k = 3$, $\eta_1 = 3$, and $\eta_2 = 3$.

**Key Generation.** Bob selects

$$
A =
\left[
\begin{array}{ccc}
329 + 26x + 34x^2 & 295 + 745x + 292x^2 & 732 + 248x + 641x^2 \\
833 + 849x + 647x^2 & 396 + 363x + 924x^2 & 312 + 803x + 31x^2 \\
176 + 501x + 802x^2 & 738 + 941x + 521x^2 & 19 + 582x + 224x^2
\end{array}
\right],
$$

$$
s =
\left[
\begin{array}{c}
1 + 3x^2 \\
1 + x \\
-2 + 2x^2
\end{array}
\right],
\quad
\text{and} \quad
e =
\left[
\begin{array}{c}
-2 + 3x - x^2 \\
1 - x + 2x^2 \\
3 + x - x^2
\end{array}
\right],
$$

and computes

$$
t = As + e =
\left[
\begin{array}{c}
274 + 180x + 257x^2 \\
484 + 971x + 42x^2 \\
664 + 145x + 399x^2
\end{array}
\right].
$$

Bob's encryption key is $(A,t)$, and his decryption key is $s$.

**Encryption.** To encrypt the plaintext message $m = 110 \leftrightarrow 1+x$ for Bob, Alice selects

$$
r =
\left[
\begin{array}{c}
-2 - 2x + x^2 \\
3x^2 \\
-1 - x + 3x^2
\end{array}
\right],
\quad
e_1 =
\left[
\begin{array}{c}
3 - 2x + 2x^2 \\
2 - 3x - x^2 \\
-3 + x - 2x^2
\end{array}
\right],
\quad
\text{and } e_2 = 3 - 3x + 2x^2
$$

and computes

$$
u = A^T r + e_1 =
\left[
\begin{array}{c}
918 + 176x + 944x^2 \\
77 + 530x + 160x^2 \\
572 + 989x + 130x^2
\end{array}
\right]
$$

and

$$
v = t^T r + e_2 + \lceil 991/2 \rceil m = 636 + 169x + 320x^2.
$$

The ciphertext is $c = (u,v)$.

**Decryption.** To decrypt $c$, Bob uses his decryption key $s$ to compute

$$
v - s^T u = 478 + 492x + 3x^2
$$

and rounds its coefficients to obtain $1+x$, thereby recovering the plaintext $m = 110$.

**Correctness of decryption.** Decryption succeeds precisely when $\operatorname{Round}_q(v-s^Tu)=m$. Now, substituting $u=A^Tr+e_1$ and $v=t^Tr+e_2+\left\lceil\frac{q}{2}\right\rceil m$ into $v-s^Tu$ yields

$$
\begin{aligned}
v-s^Tu
&= (t^Tr+e_2+\left\lceil\frac{q}{2}\right\rceil m)-s^T(A^Tr+e_1)\\
&= (s^TA^T+e^T)r+e_2+\left\lceil\frac{q}{2}\right\rceil m-s^T(A^Tr+e_1)\\
&\qquad \text{(after replacing }t^T\text{ by }s^TA^T+e^T\text{)}\\
&= e^Tr-s^Te_1+e_2+\left\lceil\frac{q}{2}\right\rceil m.
\end{aligned}
$$

Thus, $\operatorname{Round}_q(v-s^Tu)=m$ if each coefficient $E_i$ of the *decryption error polynomial*

$$
E(x)=e^Tr-s^Te_1+e_2 \tag{19}
$$

satisfies $|E_i \operatorname{mods} q| < \lceil q/4 \rceil$, i.e., $\|E\|_\infty < \lceil q/4 \rceil$.

Notice that $e,e_1,e_2,r$, and $s$ all have small coefficients, so one can hope that $E(x)$ also has relatively small coefficients (cf. Theorem 5.7).

Indeed, since $\|e\|_\infty \leq \eta_1$ and $\|r\|_\infty \leq \eta_1$, we have $\|e^Tr\|_\infty \leq kn\eta_1^2$ if $kn\eta_1^2 < q/2$.

Similarly, $\|s^Te_1\|_\infty \leq kn\eta_1\eta_2$ if $kn\eta_1\eta_2 < q/2$. Thus, if

$$
kn\eta_1^2+kn\eta_1\eta_2+\eta_2 < \lceil q/4 \rceil, \tag{20}
$$

then $\|E\|_\infty \leq kn\eta_1^2+kn\eta_1\eta_2+\eta_2 < \lceil q/4 \rceil$ and decryption succeeds.


| Parameter | Description | ML-KEM-512 | ML-KEM-768 | ML-KEM-1024 |
|:---:|:---|:---:|:---:|:---:|
| $q$ | prime modulus | 3329 | 3329 | 3329 |
| $n$ | $R_q = \mathbb{Z}_q[x]/(x^n+1)$ | 256 | 256 | 256 |
| $k$ | dimensions of $A$ | 2 | 3 | 4 |
| $\eta_1$ | coefficient bound for $s,e,r$ | 3 | 2 | 2 |
| $\eta_2$ | coefficient bound for $e_1,e_2$ | 2 | 2 | 2 |
| $(d_u,d_v)$ | compression parameters | (10,4) | (10,4) | (11,5) |
| $\lambda$ | security level | $\approx 128$ | $\approx 192$ | $\approx 256$ |

*Table 6.1: FIPS 203 parameter sets for Kyber-KEM (ML-KEM).*

---

**Algorithm 6.1:** Kyber public-key enc. scheme (without ciphertext compression)

**Domain parameters.** $q, n, k, \eta_1, \eta_2$.

**Key generation.** Bob does the following:

1. Select $A \in_R R_q^{k \times k}$, $s \in_R S_{\eta_1}^{k}$, and $e \in_R S_{\eta_1}^{k}$.
2. Compute $t = As + e$.
3. Bob's encryption (public) key is $(A,t)$; his decryption (private) key is $s$.

**Encryption.** To encrypt a message $m \in \{0,1\}^n$ for Bob, Alice does the following:

1. Obtain an authentic copy of Bob's encryption key $(A,t)$.
2. Select $r \in_R S_{\eta_1}^{k}$, $e_1 \in_R S_{\eta_2}^{k}$, and $e_2 \in_R S_{\eta_2}$.
3. Compute $u = A^T r + e_1$ and $v = t^T r + e_2 + \left\lceil \frac{q}{2} \right\rceil m$.
4. **return** $(c = (u,v))$.

**Decryption.** To decrypt $c = (u,v)$, Bob does:

1. Compute $m = \operatorname{Round}_q(v - s^T u)$.
2. **return** $(m)$.

---


**Example 6.3** (*decryption failure probability*) The ML-KEM-512 parameters (Table 6.1) are $q = 3329$, $n = 256$, $k = 2$, $\eta_1 = 3$, $\eta_2 = 2$. For these parameters, $kn\eta_1^2 + kn\eta_1\eta_2 + \eta_2 = 7682 \nless \left\lceil \frac{q}{4} \right\rceil$, and hence decryption is not guaranteed to succeed. However, significant cancellation is expected when computing $E(x) = e^T r - s^T e_1 + e_2$ so its coefficients are expected to be substantially smaller than the pessimistic bound above. Indeed, we will show in §6.2 that the probability that $\|E\|_\infty \geq \left\lceil \frac{q}{4} \right\rceil$ is less than $2^{-233}$. Hence, the probability of decryption failure is negligibly small.

**Security.** The security of Kyber-PKE is captured in the following theorem.

**Theorem 6.4** The Kyber public-key encryption scheme is indistinguishable under chosen-plaintext attack (Definition A.2) assuming that ss-D-MLWE is intractable.


**Proof:** The encryption operation can be written as

$$
\left[
\begin{array}{c}
u \\
v
\end{array}
\right]
=
\left[
\begin{array}{c}
A^T \\
t^T
\end{array}
\right]r
+
\left[
\begin{array}{c}
e_1 \\
e_2
\end{array}
\right]
+
\left[
\begin{array}{c}
0 \\
\left\lceil \frac{q}{2} \right\rceil m
\end{array}
\right].
$$

By the ss-D-MLWE$(k,k,n,q,\eta_1,\eta_1)$ intractability assumption,

$$
\left[
\begin{array}{c}
A^T \\
t^T
\end{array}
\right]
$$

is indistinguishable from random. Next, by the ss-D-MLWE$(k+1,k,n,q,\eta_1,\eta_2)$ intractability assumption,

$$
\left[
\begin{array}{c}
A^T \\
t^T
\end{array}
\right]r
+
\left[
\begin{array}{c}
e_1 \\
e_2
\end{array}
\right]
=
\left[
\begin{array}{c}
A^T r + e_1 \\
t^T r + e_2
\end{array}
\right]
\tag{21}
$$

is indistinguishable from random. Thus, from the adversary's perspective, $v$ is the sum of the random polynomial $t^T r + e_2$ and the scaled message polynomial $\left\lceil \frac{q}{2} \right\rceil m$. Hence, the adversary learns nothing about $m$. 

# Kyber-KEM
## 6.4 Kyber-KEM

The official name of Kyber-KEM in FIPS 203 is Module-Lattice-based KEM (ML-KEM). As shown in Algorithm 6.12, Kyber-KEM is derived by applying a variant of the Fujisaki-Okamoto (FO) transform to the Kyber public-key encryption scheme. The FO transform is a generic method for converting a public-key encryption scheme that is indistinguishable under chosen-plaintext attack to one that is indistinguishable under chosen-ciphertext attack (Definition A.3)

The transform utilizes three hash functions, $G, H$ and $J$, which are derived from SHA3 and SHAKE256, Kyber-PKE is employed to encrypt a randomly chosen bot string $m$ of length 256. During encapsulation, *derandomization* is applied, whereby $m$ and the encapsulation key $ek$ are hashed to produce a random seed $R$ and the secret key $K$. The random polynomial vectors $r, e_1$ and the random polynomial $e_2$ required for Kyber-PKE are derived from $R$. This process transforms the randomized Kyber public-key encryption scheme into a deterministic one, meaning the ciphertext $c$ depends only on the message $m$ and encapsulation key $ek$, without relying on any additional random bits generated during encryption

In decapsulation, the recipent decrypts the Kyber-PKE ciphertext $c$ to recover $m'$, the hashes $m'$ and $ek$ to obtain $R'$ and $K'$. He then re-encrypts $m'$ using $R'$ and compares the resulting ciphertext $c'$ with the received $c$. If the encryption was performed correctly, then $m'$ will equal to $m$ with the overwhelming probability and consequently $R' = R$ and $K' = K$. This ensures that thre re-encryption of $m$ results in the ciphertext $c$, which is why a deterministic encryption scheme is necessary. However, if decryption fails and $m' \neq m$, the re-encrypted ciphertext $c'$ will differ from $c$ with overwhelming probability.

Therfore, if $c'$ equals $c$, Bob accepts $K$ as the shared key. Otherwise, he generates a random key $\overline{K}$ obtained by hashing $c$ and the secret $s$, in this case the decapsulation is deemed to have failed

Kyber-KEM exhibits *plaintext awareness*, meaning that decapsulation will prduce $K$ (and not $\overline{K}$) only if the entity who performed the encapsulation knew $K$. This property is designed to ensure resistant to chosen-ciphertext attacks because the adversary cannot gain any useful information by submitting a ciphertext to Bob for decapsulation. Either the adversary already knew $K$ (in which case nothing new is learned when Bob returns the same $K$), or the adversary does not know $K$. in which case Bob will almost certainly return a key $\overline{K}$ that is randomly selected and independent of $K$, preventing the adversary from learning anything useful

Decapsulation fails when $c$ does not equal $c'$, in which case the key $\overline{K}$ outputted is different from the encapsulated $K$. This failure can occur even if Alice and Bob behave honestly, as there is a very small chance that a failure in the underlying Kyber-PKE will cause $m'$ to differ from $m$. However, for the domain parameters specified in FIPS 203, the probability of a Kyber-KEM failures is also extremely low.


---

**Algorithm 6.12: Kyber key encapsulation mechanism.**

**Domain parameters.** Kyber-PKE parameters $q$, $n = 256$, $k$, $\eta_1$, $\eta_2$, and hash functions $G : \{0,1\}^* \to \{0,1\}^{2n}$, $H : \{0,1\}^* \to \{0,1\}^n$, $J : \{0,1\}^* \to \{0,1\}^n$.

**Key generation.** Bob does the following:

1. Use the Kyber-PKE key generation algorithm to select a Kyber-PKE encryption key $(A,t)$ and decryption key $s$.
2. Select $z \in_R \{0,1\}^{256}$.
3. Bob's encapsulation (public) key is $ek = (A,t)$; his decapsulation (private) key is $dk = (s,ek,H(ek),z)$.

**Encapsulation.** To establish an $n$-bit shared secret key with Bob, Alice does:

1. Obtain an authentic copy of Bob's encapsulation key $ek$.
2. Select $m \in_R \{0,1\}^{256}$.
3. Compute $h = H(ek)$ and $(K,R) = G(m,h)$ where $K,R \in \{0,1\}^{256}$.
4. Use the Kyber-PKE encryption algorithm to encrypt $m$ with $ek$, and using $R$ to derive the random quantities needed for encryption; the resulting ciphertext is $c$.
5. **return** $(K,c)$. $\qquad$ // $K$ is the secret key; $c$ is the ciphertext.

**Decapsulation.** To recover the secret key $K$ from $c$ using $dk = (s,ek,H(ek),z)$, Bob does the following:

1. Use the Kyber-PKE decryption algorithm to decrypt $c$ using decryption key $s$; the resulting plaintext is $m'$.
2. Compute $(K',R') = G(m',H(ek))$.
3. Compute $\overline{K} = J(z,c)$.
4. Use the Kyber-PKE enc. algorithm to encrypt $m'$ with $ek$, and using $R'$ to derive the random quantities needed for encryption; the resulting ciphertext is $c'$.
5. If $c \neq c'$ then **return** $(\overline{K})$.
6. **return** $(K')$.

---

**Decapsulation error probability.** Kyber-KEN decapsulation fails if $\overline{K}$ is returned. The probability $p$ of this event coincides with the decryption error probability for Kyber encryption, namely $p \le 2 ^ {-138}, 2 ^ {-164}$, and $2 ^ {-174}$ for the ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets, repectively. In comparison, the targeted security levels for these parameter sets are approximately 128, 192 and 256 bits. Ideally, the decryption error probbilities for ML-KEM-768 and ML-KEM-1024 would be closer to $2 ^ {-192}$ and $2 ^ {-256}$ in view of the following potential chosen-ciphertext attack

Decapsulation fails when at least one coefficient $E_i$ of the error polynomial $E(x) = e ^ T r - s^T e_1 + e_2 - s^T e_u + e_v$ satisfies $||E_i||_\infty \ge \lceil q / 4 \rfloor$. An adversary selects a random $m$, computes the corresponding ciphertext $c$, and submits $c$ to a decapsulation oracle. This procedure is repeated until a decapsulation error occurs. Upon such a failure, the adversary learns *some* information about the secret $(s, e)$; specifically, the adversary has learned values $r, e_1, e_2, e_u$ and $e_v$ such that $|| E(x) || _\infty  \ge \lceil q / 4 \rfloor$.

For the ML-KEM-768 parameter set, an adversary can make $t = 2 ^ {64}$ queries to the decapsulation oracle and expects to observe at least one failure with probability $\varepsilon \approx 2^{-101}$. In this setting, we have $t / \varepsilon \approx 2 ^ {165}$ which is below the target security level of $2 ^ {192}$. However, it is not known how to effectively exploit the information leaked by a single decapsulation failure to break the KEM, i.e. to distinguish between $(K, C)$ and $(\overline{K}, C)$ where $(K, C)$ is a valid key-ciphertext pair and $\overline{K}$ is an independently generated random key.

Some strategies have been proposed to increase the probability of decapsulation failure. For example, an daversary might repeatedly sample random $m$ until the corresponding values $r$ and $e_1$ have unusually large norms, thereby increasin the likelihood of failure. However, no such strategies are currently known to be effective in breaking Kyber-KEM, especially when the number of decapsulation queries is limited to $2 ^ {64}$, which is a realistic upper bound in practice

**Security.** Kyber-KEM has been proven to be indistinguishable under chosen-ciphertext attack (Definition A.5) assuming that ss-D-MLWE is intractable, and that $G, H$, and $J$ are modelled as random oracles. Kyber-KEM has also been proven indistinguishable under chosen-ciphertext attack by a quantum adversary, who is permitted to make queries to $G, H$ and $J$ in quantum superposition.

# Exercises that relates to these sections
## Exercise 5.7
Prove that MLWE and D-LWE are computationally equivalent

### Solutions
**Proof.** We prove both directions.

### (1) D-MLWE $\le_P$ MLWE

Suppose an algorithm $S$ solves MLWE.

Given samples $(A,b)$, use a sufficient subset to recover a candidate $\hat s$, then check a fresh sample $(a,b_0)$ by computing

$$
\hat e=b_0-a\hat s\pmod q.
$$

If $\hat e$ is small, output MLWE; otherwise, output uniform.

For a genuine MLWE instance, $\hat s=s$ with high probability, so $\hat e\leftarrow\chi$.

For a uniform instance, $b_0$ is independent and uniform. Thus, for any fixed $\hat s$, the residual $\hat e$ is uniform in $R_q$ and is unlikely to be small.

Hence, $S$ yields an efficient distinguisher, proving

$$
\boxed{\mathrm{D\text{-}MLWE}\le_P\mathrm{MLWE}.}
$$

### (2) MLWE $\le_P$ D-MLWE

Suppose an efficient distinguisher $D$ solves D-MLWE.

Under the splitting assumption,

$$
R_q\cong\mathbb F_q^n
$$

by the Chinese Remainder Theorem (CRT). Therefore, the secret can be represented by its CRT coordinates

$$
s_j=(s_j^{(1)},\ldots,s_j^{(n)}).
$$

Define hybrids $H_0,\ldots,H_n$, where the first $i$ CRT components of $b$ are replaced by independent uniform values:

$$
H_0=\mathrm{MLWE},\qquad H_n=\mathrm{Uniform}.
$$

Since $D$ distinguishes $H_0$ from $H_n$, a hybrid argument gives an index $i$ for which $D$ distinguishes $H_{i-1}$ from $H_i$ with non-negligible advantage.

To recover $s_j^{(i)}$, guess $g\in\mathbb F_q$. Choose a uniformly random vector $u$ supported only on CRT component $i$, and construct

$$
A'=A+u\mathbf e_j^T,\qquad b'=b+gu,
$$

where $\mathbf e_j$ is the $j$-th standard basis vector. Randomize the first $i-1$ CRT components of $b'$.

Since

$$
b'=A's+e+(g-s_j)u,
$$

we have:

- If $g=s_j^{(i)}$, the resulting distribution is $H_{i-1}$.
- If $g\ne s_j^{(i)}$, the $i$-th CRT component is uniform, giving $H_i$.

Thus, $D$ identifies the correct guess $g$.

Ring automorphisms, which permute CRT components and preserve the error distribution, allow the same distinguishing gap to be used to recover all CRT coordinates. Repeating for each secret component recovers $s$ in polynomial time, since $q$ is polynomially bounded.

Therefore,

$$
\boxed{\mathrm{MLWE}\le_P\mathrm{D\text{-}MLWE}.}
$$

Combining both directions,

$$
\boxed{\mathrm{MLWE}\equiv_P\mathrm{D\text{-}MLWE}.}
$$

## Exercise 5.8
Prove that MLWE and ss-MLWE are computationally equivalent

### Solutions
**Proof.** We prove both directions.

### (1) MLWE $\le_P$ ss-MLWE

Suppose an algorithm $S$ solves ss-MLWE.

Given an MLWE instance

$$
b=As+e\pmod q,
$$

where $s$ is uniform, partition the samples as

$$
A=
\begin{pmatrix}
A_0\\
A_1
\end{pmatrix},
\qquad
b=
\begin{pmatrix}
b_0\\
b_1
\end{pmatrix},
$$

where $A_0\in R_q^{k\times k}$ is invertible.

We have

$$
b_0=A_0s+e_0,\qquad
b_1=A_1s+e_1.
$$

From the first equation,

$$
s=A_0^{-1}(b_0-e_0).
$$

Substituting into the second,

$$
\begin{aligned}
b_1
&=A_1A_0^{-1}(b_0-e_0)+e_1\\
&=A_1A_0^{-1}b_0-A_1A_0^{-1}e_0+e_1.
\end{aligned}
$$

Define

$$
\boxed{
A'=-A_1A_0^{-1},\qquad
b'=b_1-A_1A_0^{-1}b_0.
}
$$

Then

$$
\boxed{b'=A'e_0+e_1.}
$$

Since $e_0\leftarrow\chi^k$, it is a short secret. Moreover, $A'$ is uniform and independent of $e_0,e_1$.

Thus, $(A',b')$ is an ss-MLWE instance.

Use $S$ to recover $e_0$, and compute

$$
\boxed{s=A_0^{-1}(b_0-e_0).}
$$

Therefore,

$$
\boxed{\mathrm{MLWE}\le_P\mathrm{ss\text{-}MLWE}.}
$$

### (2) ss-MLWE $\le_P$ MLWE

Suppose an algorithm $S'$ solves MLWE.

Given an ss-MLWE instance

$$
b=As+e,
$$

where $s$ is short, choose

$$
r\overset{\$}{\leftarrow}R_q^k
$$

and construct

$$
b'=b+Ar.
$$

Then

$$
\begin{aligned}
b'&=As+e+Ar\\
&=A(s+r)+e.
\end{aligned}
$$

Since $r$ is uniform,

$$
s'=s+r
$$

is uniformly distributed over $R_q^k$.

Thus, $(A,b')$ is an MLWE instance.

Use $S'$ to recover $s'$, then compute

$$
\boxed{s=s'-r.}
$$

Hence,

$$
\boxed{\mathrm{ss\text{-}MLWE}\le_P\mathrm{MLWE}.}
$$

Combining both reductions,

$$
\boxed{
\mathrm{MLWE}\equiv_P\mathrm{ss\text{-}MLWE}.
}
$$

*The first reduction requires enough samples and an invertible $A_0$, which can be obtained with non-negligible probability in the standard parameter setting.*

## Exercise 5.9
Prove that ss-MLWE and ss-D-MLWE are computationally equivalent

### Solutions
**Proof.** We use Exercises 5.7 and 5.8, together with an equivalence between their decisional variants.

### Step 1. Equivalence of D-MLWE and ss-D-MLWE

First, given an ss-D-MLWE instance $(A,b)$, choose uniform $r\in R_q^k$ and set

$$
b'=b+Ar.
$$

If $b=As+e$ with short $s$, then

$$
b'=A(s+r)+e,
$$

where $s+r$ is uniform. If $b$ is uniform, then $b'$ remains uniform.

Thus,

$$
\boxed{\mathrm{ss\text{-}D\text{-}MLWE}\le_P\mathrm{D\text{-}MLWE}.}
$$

Conversely, given a D-MLWE instance, partition $A,b$ as in Exercise 5.8 and construct

$$
A'=-A_1A_0^{-1},
\qquad
b'=b_1-A_1A_0^{-1}b_0.
$$

If the input is MLWE, then

$$
b'=A'e_0+e_1,
$$

which is an ss-MLWE sample.

If $b$ is uniform, then $b'$ is uniform and independent of $A'$.

Therefore,

$$
\boxed{\mathrm{D\text{-}MLWE}\le_P\mathrm{ss\text{-}D\text{-}MLWE}.}
$$

Consequently,

$$
\boxed{
\mathrm{D\text{-}MLWE}
\equiv_P
\mathrm{ss\text{-}D\text{-}MLWE}.
}
$$

### Step 2. Apply transitivity

From Exercise 5.8,

$$
\mathrm{ss\text{-}MLWE}\equiv_P\mathrm{MLWE}.
$$

From Exercise 5.7,

$$
\mathrm{MLWE}\equiv_P\mathrm{D\text{-}MLWE}.
$$

From Step 1,

$$
\mathrm{D\text{-}MLWE}
\equiv_P
\mathrm{ss\text{-}D\text{-}MLWE}.
$$

By transitivity of polynomial-time reductions,

$$
\boxed{
\mathrm{ss\text{-}MLWE}
\equiv_P
\mathrm{ss\text{-}D\text{-}MLWE}.
}
$$

This completes the proof.
