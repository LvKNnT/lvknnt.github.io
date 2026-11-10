---
title: "[CS432] Cryptography - Chapter 7"
date: 2026-11-08
description: "RSA"
series: "Cryptography Course"
seriesOrder: 6
---

# RSA

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter7.pdf) so this is just my own notes

- 7.1 : Basic RSA
- 7.2 : QQ browser encryption
- 7.3 : Integer factorization
- 7.4 : RSA encryption
- 7.5 : RSA signatures
- 7.6 : PKCS #1 v1.5 RSA signatures

## 7.1 Basic RSA
- Invented by Ron **R**ivest, Adi **S**hamir and Len **A**dleman in 1977
- RSA is used for `public-key encryption` and `signatures`

### RSA key generation
Each entity $A$ does the following :
- Randomly select two large, distinct primems $p$ and $q$ of the same bitlength
- Compute $n = pq$ and $\phi = \phi(n) = (p - 1)(q-1)$. ($n$ is called the `RSA modulus)
- Select arbitrary integer $e, 1 < e < \phi$, with $gcd(e, \phi) = 1$. ($e$ is called the `encryption exponent`)
- Compute the integer $d, q < d < \phi$, with $ed \equiv 1$. (mod $\phi$). ($d = e ^ {-1}$ mod $\phi$ is called the `decryption exponent`)
- $A$'s public key is $(n, e)$; het private key is $d$

## 7.2 QQ browser encryption
You should read the slides duh

## 7.3 Integer factorization
### Special-purpose factoring algorithms
**Example** : Trial division, Pollard's $p-1$ algorithm, Pollard's $p$ algorithm, elliptic curve factoring method, special number field sieve

- These algorithm are only efficient if the number $n$ being factored has a `special form` : $n$ has a prime factor $p$ that is relatively small, or $p-1$ has only small prime factors (smooth prime)
- To maximize reisstance to these factoring attacks on RSA moduli, onne should select the RSA primes $p$ and $q$ at `random` and of the `same bitlength`

### General-purpose factoring algorithms
These are factoring algorithms whose running times do not depend on any properties of the number being factored (other than their size)

There have been two major developments in the history of factoring :
- `Quadratic sieve factoring algorithm (QS)` : Running time $L_n[1 / 2,1]$
- `Number field sieve factoring algorithm (NFS)` : Running time $L_n[1 / 3,1.923]$

*Recall* : $L_n[a,c] = O\left(\exp\left((c+o(1))(\log_e n)^\alpha(\log_e\log_e n)^{1-\alpha}\right)\right)$

`RSA Factoring Challenge` : [en.wikipedia.org/wiki/RSA_Factoring_Challenge](https://en.wikipedia.org/wiki/RSA_Factoring_Challenge)

### Summary
Factoring is `believed` to be a hard problem. However, we have no `proof` or `theoretical evidence` that factoring is indeed hard

In fact, factoring is known to be `easy` on a quantum computer :
- `Shor's algorithm` (1994) can factor $n$ in $O((\log n)^3)$ gates
- The largest number factored with Shor's algorithm is the number `21`
- *The big open question is whether large-scale quantum computers can ever be built`*

1024-bit RSA is considered insecure, but still deployed (in legacy applications)

Most applications have moved to `2048-bit` and `3072-bit` RSA

## 7.4 RSA encryption
### Security of RSA encryption
`Security of RSA key generation` : If an adversary can factor $n$, she can compute $d$ from $(n, e)$. It has been proven that any efficient method for computing $d$ from $(n, e)$ is equivalent to factoring $n$

`Security of Basic RSA encryption` : A basic notion of security is that it should be computationally infeasible to compute $m$ from $c$. This is known as the RSA problem

`RSA problem (RSAP)` : Given an RSA public key $(n, e)$ and $c = m^e \pmod{n}$ (where $m \in_R [0, n-1]$), compute $m$

The only effective method known for solving RSAP is to factor $n$ (and thereafter compute $d$ and then $m$). Henceforth, we shall assume that *RSAP is intractable*

### Dictionary attack on Basic RSA encryption
`Dictionary attack` : Suppose that the plaintext $m$ is chosen from a relatively small (and known) set $\mathcal{M}$ of messages. Then, given a target ciphertext $c$, the adversary can encrypt each $m \in \mathcal{M}$ until $c$ is obtained

`Countermeasure` : Prepend a randomly selected 128-bit string (called `salt`) to $m$ prior to encryption. Note that $m$ is now encrypted to one of $2^{128}$ possible ciphertexts, so a dictionary attack is infeasible

### Chosen-ciphertext attack on Basic RSA encryption
Suppose that the adversary $E$ has a target ciphertext $c$ that was encrypted for $A$. Suppose also that $E$ can induce $A$ to decrypt *any* ciphertext for $E$, *except for c itself*. (We can say that $E$ has a `decryption oracle`). Then $E$ can decrypt $c$ as follow :
- Select arbitrary $x \in [2, n-1]$ with $\gcd(x, n-1) = 1$
- Compute that $\hat{c} = cx^e \pmod{n}$, where $(n, e)$ is $A$'s public key. (Note that $\hat{c} \neq c$, unless $\gcd(c,n) \neq 1$)
- Obtain the decryption $\hat{m}$ of $\hat{c}$ from the decryption oracle. (Note that $\hat{m} \equiv \hat{c} ^ d \equiv c^dx^{ed} \equiv mx \pmod{n}$)
- Compute $m = \hat{m}x^{-1} \pmod{n}$

`Countermeasure` : Add some prescribed formatting to $m$ prior to encryption. After decryptiing the ciphertext $c$, if the plaintext is not properly formatted, then $A$ rejects $c$ (and so the decryption oracle does not return a plaintext).

`Summary` : RSA encryption should incorporate `salting` and `formatting`

### RSA Optimal Asymmetric Encryption Padding (OAEP)
You should read the slides

### Key encapsulation mechanisms
A `key encapsulation mechanism` (KEM) allows two parties to establlish a shared secret key, called a session key

A KEM is comprised of three algorithms :
- `Key generation` : Each user, say Alice, uses this algorithm to generate an `encapsulation key` $ek$ (public key) and a `decapsulation key` $dk$ (the private key)
- `Encapsulation` : Bob use Alice's encapsulation key $ek$ to generate a secret key $k$ and ciphertext $c$, and sends $c$ to Alice
- `Decapsulation` : Alice uses her decapsulation key $dk$ to recover $k$ from the cciphertext $c$

### RSA-KEM
`Key encapsulation` : To select and transport a session key $k$ for $A$, $B$ does the following:

- Obtain an authenticated copy of $A$'s
encapsulation key $(n,e)$.
- Select $r \in_R [0,n-1]$.
- Compute $c = r^e \bmod n$ and $k = \operatorname{KDF}(r)$.
- Send $c$ to $A$.

`Key generation :`
- $A$'s (public) encapsulation key is $ek = (n,e)$.
- $A$'s (private) decapsulation key is $dk = d$.

`Key encapsulation : ` $A$ processes $c$ as follows:
- Compute $r = c^d \bmod n$ and $k = \operatorname{KDF}(r)$.
- The session key is $k$.

## 7.5 RSA signatures 
`Key generation` : Each entity $A$ does the following :
- Randomly select two large distinct primes $p, q$ of the same bitlength
- Compute $n = pq$ and $\phi = (p-1)(q-1)$
- Select arbitrary $e, 1 < e < \phi$, such that $\gcd(e, \phi) = 1$
- Compute $d, 1 < d < \phi$, such that $ed \equiv 1 \pmod{\phi}$ 
- $A$'s public key is $(n, e)$ : $A$'s private key is $dd$

`Signature generation` : To sign a message $m \in \{0, 1\}^*$, $A$ does the following :
- Compute $M = H(m)$, where $H$ is a hash function
- Compute $s = M^d \pmod{n}$ (so $s^e \equiv M^{ed} \equiv M \pmod{n}$)
- $A$'s signature on $m$ is $s$

`Signature verification` : To verify $A$'s signed message $(m, s)$, $B$ does the following :
- Obtain an authentic copy of $A$'s public key $(n, e)$
- Compute $M = H(m)$
- Compute $M' = s^e \pmod{n}$
- Accept $(m, s)$ if and only if $M = M'$

### Security of the basic RSA signature scheme
`Hardness of RSAP` : We require that RSAP be intractable, since otherwise $E$ could forge $A$'s signature as follows :
- Select arbitrary $m$
- Compute $M = H(m)$
- Solve $s^e \equiv M \pmod{n}$ for $s$
- Then $s$ is $A$'s signature on $m$

### The adversary
**Goal of the adversary** :
- `Total break` : $E$ recovers $A$'s private key, or a method for systematically forging $A$'s signatures
- `Existential forgery` : $E$ forges $A$'s signature for a single message of $E$'s choosing : $E$ might not have any control over the content or structure of this message

**Attack model** : 
- `Key-only attack` : the only information $E$ has is $A$'s public key
- `Known-message attack` : $E$ knows some message-signature pairs
- `Chosen-message attack` : $E$ has access to a signing oracle which it can use to obtain $A$'s signatures on some messages of its choosing

### Security definition
**Definition** : A signature scheme is `secure` if it is existentially unforgeable by a computationally bounded adversary who launches a chosen-messsage attack

Note : The adversary has access to a signing oracle. Her goal is to compute a single valid message0signature pair for any message (of the adverary's choosing) that was not previously given to the signing oracle

**Question** : Is the basic RSA signature scheme secure ?
**Answer** : 
- `No` : $H$ is SHA-256 (details omitted)
- `Yes` : $H$ is "full domain"

### Full Domain Hash RSA (RSA-FDH)
- Same as the basic RSA signature scheme, except that the hash function is $H : \{0, 1\}^* \rightarrow [0, n-1]$ where $n$ is the RSA modulus
- In practice, one could define : 
$$
H(m) = \operatorname{SHA\text{-}256}(1,m)
\parallel \operatorname{SHA\text{-}256}(2,m)
\parallel \cdots \parallel
\operatorname{trunc}(\operatorname{SHA\text{-}256}(t,m)).
$$

**Theorem** : If RSAP is intractable and $H$ is a random function, then RSA_FDH is a secure signature scheme

## 7.6 PKCS #1 v1.5 RSA signatures
PKCS : Public Key Cryptography Standards

### Bleichenbacher's attack : Breaking RSA by hand
`Assumption` : 
- The encryption exponent is $e = 3$ : this is commonly used in practice
- The hash function is $H =$ SHA-1 : this is without loss of generality
- The RSA modulus $n$ has bitlength 3072 (384 bytes) : This is without much loss of generality
- The verifier doesn't check that there are no leftover bytes to the right of $h$ : it turned out many RSA implementations omitted this step, including OpenSSL, SUN's JAVA library, Adobe Acrobat, Firefox, ...

`Attack` : 
- Select arbitrary $m \in \{0, 1\}^*$
- Compute $h = H(m)$
- Let $D$ be the following 288-bit integer : 8-bit 00 + 120-bits hash name + 160-bit h
- Let $N  = 2^{288} - D$
- Check that $3 \mid N$, if $3 \nmid N$, then modify $m$ slightly and go to step 2
- Let $s = 2 ^ {1019} - 2 ^ {34} N/3$
- Output $(m, s)$

`Claim` : The (faulty) verifier will accept $(m, s)$

`Proof` : The verifier computes :
$$
\begin{aligned}
M &= s^e \bmod n
= (2^{1019} - 2^{34}N/3)^3 \bmod n \\
&= 2^{3057} - 2^{2072}N
  + 2^{1087}N^2/3 - (2^{34}N/3)^3 \bmod n \\
&= 2^{3057} - 2^{2072}(2^{288} - D)
  + \text{garbage} \pmod n \\
&= 2^{2360}(2^{697} - 1)
  + 2^{2072}D + \text{garbage}.
\end{aligned}
$$
So, the verifier extracts $h$, checks that $h = H(m)$ and accepts $(m, s)$
