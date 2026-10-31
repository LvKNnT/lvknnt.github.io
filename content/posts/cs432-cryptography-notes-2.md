---
title: [CS432] Cryptography - Chapter 3
date: 2026-10-24
description: Hash function
series: Cryptography Course
seriesOrder: 2
---

# HASH FUNCTIONS

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter-2.pdf) so this is just my own notes

- 3.1 : Fundamental concepts 
- 3.2 : Relationships between PR, 2PR, CR
- 3.3 : Generic attacks
- 3.4 Iterated hash functions
- 3.5 : SHA-256

## 3.1 Fundamental concepts

### Definition of a hash function
A `hash function` is a mapping $H$ such that :
- $H$ maps binary messages of arbitrary lengths $\le L$ to outputs of a fixed length $n$ : $H : \{0, 1\} ^ {\le L} \rightarrow \{0, 1\} ^ n$
- $H(x)$ can be efficiently computed for all $x \in \{0, 1\} ^ {\le L}$

- $H$ can be called an `n-bit hash function`. $H(x)$ is called the `hash` or `message digest` of x

- Notes : 
    - The description of a hsah function is public; there are no secret keys
    - For simplicity, we will usually write $\{0, 1\} ^ *$ instead of $\{0, 1\} ^ {\le L}$
    - More generally, a hash function is an efficiently computable function from a set $S$ to a set $T$

### Preimage resistance (PR)
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is `preimage resistant` if, given a hash value $y \in_R \{0, 1\} ^ n$, it is computationally infeasible to find (with non-negligible success probability) $any x \in \{0 , 1\} ^ x$ with $H(x) = y$. ($x$ is called a `preimage` of $y$)

`Password protection` on a multi-user computer system :
- The server stores [userid, $H(password)$] in a password file
- If an attacker obtains a copy of the password file, she does not learn any passwords.
- This application requires preimage resistance.

### 2nd preimage resistance (2PR)
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is a `2nd preimage resistant` if, given $x \in_R \{0, 1\} ^ *$, it is computationally infeasible to find (with non-negligible success probability) $any x' \in \{0, 1\} ^ x$ with $x' \neq x$ and $H(x') = H(x)$

`Modification Detection Codes (MDCs)` :
- To ensure that a message $m$ is not modified by unauthorized means, one computes $H(m)$ and protects $H(m)$ from unauthorized modification.
- This is useful in malware protection
- This application requires 2nd preimage resistance

### Collision resistance (CR)
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is a `collision resistance` if it is computationally infeasible to find (with non-negligible success probability) $x, x' \in \{0, 1\} ^ *$ with $x' \neq x$ and $H(x') = H(x)$. Such a pair $(x, x')$ is called a `collision` for $H$.

`Message digests for digital signature schemes` :
- For reasons of efficiency, instead of signing a (long) message $x$, the (much shorter) message digest $h = H(x)$ is signed
- This appliaction requires preimage-resistance, 2nd preimage resistnace, and collision resistance.
- To see why collision resistance is required, suppose that the legitimate signer Alice can find a collision $(x_1, x_2)$ for $H$. Alice can sign $x_1$ and later claim to have signed $x_2$.

### Some other applications of hash function
- `Message Authentication Codes` : HMAC
- `Pseudorandom bit generation` : Distilling random bits `s = H(x_1, ..., x_t)$ from several *pseudorandom* sources $x_1, ... x_t$
- `Key derivation functions` (KDF) : Deriving a cryptographic key from a secret
- `Proof-of-work` in cryptocurrencies (Bitcoin)
- `Quantum-safe signature schemes` 

# 3.2 Relationships between PR, 2PR, and CR

Look for slides for more details.

# 3.3 Generic attacks
A `generic attack` on hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ does not exploit any properties that the specific hash function might have.

- In the `analysis` of a generic attack, we view $H$ as a `random function` in the sense that for each $x \in \{0, 1\} ^ x$, the hash value $y = H(x)$ was defined by selecting $y \in_R \{0, 1\} ^ n$.
- From a security point of view, a random function is an `ideal` hash function. However, random functions are not suitable for practical applications because they cannot be compactly described.

## Generic attack for finding images
Bruteforce ahh momento

## Generic attack for finding collisions
Hash-table ahh momento

## VW parallel collision search
- `VW : van Oorschot & Wiener` (1993)
- Expected number of hash operations : $\approx \sqrt{2 ^ n}$
- Expected space required : negligible
- Easy to parallelize - m-fold speedup with *m* processor
- The VW collision-finding algorithm can easily be modified to find *meaningful* collision

**Conclusion** : If collision resistance is desired, then use an n-bit hash function with $n \ge 256$

TLDR : instead of storing each *minor jump*, now we storing *big jump* : like a jump between 2 nodes having 12 $0$ bit. That way, we both reduce the memory-cost while even able to save the time costed by the I/O overhead in the storing node process.

## 3.4 Iterated hash functions
> Merkle's meta method

To compute $H(x)$ where $x$ has bitlength $b < 2^r$ :
- Break up $x$ into r-bit block, padding if necessary
- Define $x_{t+1}$, the `length-block`, to hold the right-justified binary representation of $b$
- Define $H_0 = IV$
- Compute $H_i = f(H_{i-1}, x_i)$ for $i = 1,2 ,..., t+1$, called `chaining variables`
- Define $H(x) = H_{t+1}$

### Collision resistance of iterated hash function
**Theorem (Merkle)** : If the compression function $f$ is collision resistant, then the iterated hash function $H$ is also collision resistant

Thus Merkle's theorem reduces the problem of designing collision-resistant hash functions to that of designing collision-resistant compression function

### MDx-family of hash functions
- `MDx` is a family of iterated hash functions
- `MD4` was proposed by Ron Rivest in 1990
- MD4 has `128-bit outputs`
- Leurent (2008) discovered an algorithm for finding MD4 preimages in $2^{102}$ operations

## 3.5 SHA-256
- Iterated hash function (Merkle's meta method)
- n = 256, r = 512
- `Compression function` is $f : \{0, 1\} ^ {256 + 512} \rightarrow \{0, 1\} ^ 256$
- *Input* : bit string x of arbitrary bitlength $b \ge 0$
- *Output* : 256-bit hash value $H(x)$ of x

### SHA-256 constants
- `32-bit initial chaining values (IVs)` : THese words were obtained by taking the first 32 bits of the fractional parts of the square roots of the first 8 prime numbers
- `Per-round integer additive constants` : These words were obtained by taking the first 32 bits of the fractional parts of the cube roots of the first 64 prime numbers

