---
title: "[CS432] Cryptography - Chapter 8"
date: 2026-11-11
description: "Elliptic curve cryptography"
series: "Cryptography Course"
seriesOrder: 7
---

# ELLIPTIC CURVE CRYPTOGRAPHY

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter8.pdf) so this is just my own notes

- 8.1 : Elliptic curves
- 8.2 : Elliptic curve discrete logarithm problem
- 8.3 : Elliptic curve cryptosystems
- 8.4 : ECDH key agreement
- 8.5 : ECDSA signature scheme

## 8.1 Elliptic curves
Let $F = \mathbb{R}$ or $F = \mathbb{Z}_p$ (whre $p \ge 5$ is prime) 

`Definition` : An *elliptic curve E over F* is defined by a Weierstrass equation 
$$
E/F : Y^2 = X^3 + aX + b
$$
where $a,b \in F$ with $4a^3 + 27b^2 \neq 0$

`Definition` : The *set of F-rational point* on $E$ is $E(F) = \{(x, y) \in F \times F : y^2 = x^3 + ax + b\} \cup \{\infty\}$, where $\infty$ is a special point called the `point at infinity`

### Number of points 
Let $E/F : Y^2 = X^3 + aX + b$ be an elliptic curve

Then $\#E(\mathbb{Z}_p)$ is finite

It is easy to see that $1 \le \#E(\mathbb{Z}_p) \le 2p + 1$

In fact, the following is true :
- `Hasse's Theorem` : Let $E$ be an elliptic curve defined over $\mathbb{Z}_p$. Then $(\sqrt{p} - 1)^2 \le \#E(\mathbb{Z}_p) \le (\sqrt{p} + 1)^2$
Hence $\#E(\mathbb{Z}_p) \approx p$

`Fact` : There is an efficient (polynomial-time) algorithm for determining $\#E(\mathbb{Z}_p)$

### Point addition
There is a "natural" way to add two points in $E(F)$ to get a third point in $E(F)$

Let $E$ be an alliptic curve defined over $\mathbb{R}$ Think of $\infty$ as an imaginary point through which every vertical line passes (in either direction)

The `geometric rule` for point addition is the following :
- Let $P, Q \in E(\mathbb{R})$
- Let $\ell$ denote the straight line through $P$ and $Q$
- Let $T \in E(\mathbb{R})$ be the third point of intersection of $\ell$ with the elliptic curve
- Then $P + Q$ is the reflection of $T$ in the $X$-axis

### Addition rule
Let $E$ be an alliptic curve defined over $\mathbb{F}$

`A1` : $P + \infty = \infty + P = P$ for $\text{all } P \in E(F)$

`A2` : If $P = (x, y) \in E(F)$, then $-P = (x, -y)$; also $-\infty = \infty$. Furthermore, $P + (- P) = (- P) + P = \infty \text{ for all } P \in E(F)$

`A3` : Let $P = (x_1, y_1), Q = (x_2, y_2) \in E(F)$, with $P \neq \pm Q$. Then $P + Q = (x_3, y_3)$ where $x_3 = \lambda^2 - x_1 - x_2, y_3 = -y_1 + \lambda(x_1 - x_3), \text{ and } \lambda = \frac{y_2 - y_1}{x_2 - x_1}$

`A4` : Let $P = (x_1, y_1) \in E(F)$, with $P \neq -P$. Then $ P + P = (x_3, y_3)$ where $x_3 = \lambda^2 - 2x_1, y_3 = -y_1 + \lambda(x_1 - x_3), \text{ and } \lambda = \frac{3x_1^2 + a}{2y_1}$

### Abelian group
`Fact` : $(E(F), +)$ is an `abelian group`

In other words, the addition rule satisfies the followinng properties :
- P1 : $P + \infty = P$ for all $P \in E(F)$
- P2 : For each $P \in E(F)$, there exists $Q \in E(F)$ such that $P + Q = \infty$
- P3 : $P + Q = Q + P$ for all $P, Q \in E(F)$
- P4 : $(P + Q) + R = P + (Q + R)$ for all $P, Q, R \in E(F)$

`Notes` : P4 (associativity) needs proof, but we won't do this

`Point subtraction` is $P - Q = P + (- Q)$

## 8.2 Elliptic curve discrete logarithm problem

### Point multiplication
Let $E : Y^2 = X^3 + aX + b$ be an elliptic curve defined over $F = \mathbb{Z}_p$
Let $n = \#E(\mathbb{Z}_p)$, and suppose that `n is prime`. (Recall that $n \approx p$ by Hasse's Theorem)

`Definition` : Let $P \in E(\mathbb{Z}_p)$ and let $k \in \mathbb{N}$
- Then $kP = P + P + \dots + P.$ ($k$ times)
- Also, $0P = \infty$, and $(-k)P = - (kP)$

The operation $kP$ is called `point multiplication`

### Generators
`Theorem` : Suppose $n = \#E(\mathbb{Z}_p)$ is prime, and let $P \in E(\mathbb{Z}_p)$ with $P \neq \infty$. Then :
- $nP = \infty$
- The points $\infty, P, 2P, \dots, (n-1)P$ are distinct, and so $E(\mathbb{Z}_p) = \{\infty, P, 2P, \dots, (n-1)P\}$

$P$ is called a `generator` of $E(\mathbb{Z}_p)

`Note` : $kP = (k \text{ mod } n)P$ for all $k \in \mathbb{Z}$

### Elliptic curve discrete logarithm problem
`Definition` : The `elliptic curve discrete logarithm problem` (ECDLP) is the following : Given $E, p, n, P \in E(\mathbb{Z}_p)$ (with $P \neq \infty$), and $Q \in_R E(\mathbb{Z}_p)$, find the integer $\ell \in [0, n-1]$ such that $Q = \ell P$

`Definition` : The integer $\ell$ is called the `discrete logarithm` of $Q$ to the base $P$, written $\ell = \log_p{Q}$

### Alogrithm for olving ECDLP
`ECDLP` : Given $E, p, n, P \in E(\mathbb{Z}_p)$ (with $P \neq \infty$), and $Q \in_R E(\mathbb{Z}_p)$, find the integer $\ell \in [0, n-1]$ such that $Q = \ell P$

- `Bruteforce` : Compute $P, 2P, \dots, (n-1)P$ until $Q$ is encountered. The running time of this attack is $O(n)$ point additions, or $O(p)$ point additions (since $n \approx p$)
    This is a *fully exponential-time attack*, since an ECDLP instance has size $O(\log{p})$ bits

- `Shank's algorithm` : Let $m = \lceil \sqrt{n} \rceil$ By the division algorithm there exist unique integers $q, r$ with $\ell = qm - r$, where $0 \le r < m$ and $0 \le q < m$. Then $\ell - qm = r$. Multiplying both sides by $P$ gives $\ell P - qmP = rP$, so $Q - qM = rP$, where $M = mP$

    The equation $Q - qM = rP$ suggests the following ECDLP algorithm :
    - For each $r \in [0, m-1]$ compute $rP$ and store $(rP, r)$ in a sorted table 
    - Compute $M = mP$
    - For each $q \in [0, m-1]$, compute $R = Q- qM$ and look it up in the table. If $R = rP$, then output "$\ell = qm + r$" and STOP

    `Analysis` : 
    - Runtime : $O(m) = O(\sqrt{p})$ point additions
    - Space requirement : $O(\sqrt{p})$ points

- `Pollard's algorithm` : The ECDLP can be solved in time $\approx \sqrt{p}$ point additions and negligible storage. Moreover, VW parallel collision search can be used to perfectly parallelize Pollard's algorithm 

- `Special cases` :
    - The ECDLP can be solved in polytime if $n = p$
    - The ECDLP can be solved in subexponential time if $n$ divides $(p^c - 1)$ for a small integer $c$ (e.g. $c \le 100$)

- `Shor's algorithm` : The ECDLP can be solved in time $O((\log{p})^2) on a quantum computer

`Summary` : Pollard's algorithm is the fastest algorithm known for solving the ECDLP on a classical computer, with the exception of some very special ellipitic curve that can easily be avoided

## 8.3 Elliptic curve cryptosystems
ECC was proposed by Neal Koblitz and Victor Miller in 1985

`RSA` : Security is based on the hardness of integer factorization. The fastest attacks known take `subexponential time`

`ECC` : Security is based on the hardness of the ECDLP. The fastest attacks known take `fully exponential time`

Thus, elliptic curve cryptographic ssytems can use *smaller parameters* than their RSA counterparts, *while achieving the same security level*

### P-256 elliptic curve
- P-256 is an elliptic curve chosen by the National Security Agency in `1998` for U.S government use
- P-256 should be used in applicantions that require the `128-bit security level` (since $\sqrt{p} \approx \sqrt{2 ^ {256}} = 2 ^ {128}$)

### Modular reduction
- The primes $p = 2 ^ {256} - 2^{224} + 2^{192} + 2 ^ {96} - 1$ and $p = 2^{384} - 2^{128} - 2^{96} + 2^{32} -1$ used in `P-256` and `P-384` were chosen because the operation of reduction modulo $p$ can be easily implemented on a 32-bit machine *without doing a costly long division*
- A "`64-bit machine`" means a compupter with built-in instructions for addition, substraction, and multiplication of 64-bit integers

### 8.4 Elliptic Curve Diffle-Hellman
`ECDH` is the elliptic curve analogue of a key agreement protocol first proposed by Diffle and Hellman in 1975

`Objective` : Two communicating parties agree upon a shared secret $k$. They can then use $k$ in a symmetric-key scheme such as AES-GCM

`ECDH domain parameters` :
- Elliptic curve $E$, defined over $\mathbb{Z}_p$ with $n = \#E(\mathbb{Z}_p)$ prime (e.g. P-256)
- A base point $P \in E(\mathbb{Z}_p), P \neq \infty$
- A key derivation function KDF

### Unauthenticated ECDH
- Alice and Bob compute the same $k$ since $xY = x(yP) = (yx)P = y(xP) = yX$
- An eavesdropper sees $X, Y$ (and the domain parameters). Her goal is to compute $K = xY = yX$
- The fastest way known to accomplish this is to first compute $x$ or $y$; this is an instance of `ECDLP`

### Maliciouos Intruder-in-the-Middle (MITM) attack
- Since $X$ and $Y$ are not authenticated, ECDH is vulnerable to a `MITM attack`
- Suppose now that Alice sends $c = E_{k_1}(m)$ to Bob. Eve intercepts $c$, computes $m = E_{k_1}^{-1}(c), c' = E_{k_2}(m)$, and sends $c'$ to Bob. Bob computes $m = E_{k_2}^{-1}(c')$

### Authenticated ECDH
- Alice sends Bob $X$, her ECDSA signatures on $X$, and a certificate for the ECDSA public key
- Bob verifies the certificate, and then uses Alice's public key to verify her signature on $X$.
- Similarly, Bob signs $Y$

`Note` : The MITM attack is thwarted

### RSA key transport or ECDH in TLS?
`RSA key transport` : The session key $k$ is selected by a client and encrypted with a server's long-term RSA public key; call the resulting ciphertext $c$. The session key $k$ is then used to encrypt and authenticate all data exchanged for the remainder of the session (e.g. using AES-GCM)

- **Drawback** : `Forward secrecy` is not provided
- That is, supposed that an eavesdropper saves a copy of $c$ and the encrypted data. If, at a future point in time, the eavesdropper is able to break into the server and learn its RSA private key, then the eavesdropper is able to decrypt $c$ thereby obtaining $k$; she can then decrypt the data that was encrypted with $k$
    - Alternatively, a law enforcement agent could demand that the server hand over its RSA private key
- **In contrast. forward secrecy can be provided if ECDH is used to establish $k$**

### ECDH and forward secrecy
When a web browser (Alice) connects to a secured web site (Bob) :
- Alice selects $x \in_R [1, n-1]$ and sends $X = xP$ to Bob
- Bob selects $y \in_R [1, n-1]$, signs $Y = yP$ with its RSA signing key, and sends $Y$ and the signatures to Alice
- Alice verifies the signature using Bob's RSA public key
- Both Alice and Bob compute the session key $k = \text{KDF}(xyP)$
- `Alice deletes $x$ and Bob deletes $y$`
- Alice and Bob use $k$ to authenticate/encrypt data with AES-GCM
- `At the end of the session, Alice and Bob delete $k$`

`Note` : Forward secrecy is provided

**Google** started using ECDH for forward secrecy in 2011

### The ECDH stack
- Infrastructure for authenticating $X$ and $Y$ 
- ECDH
- Point multiplication : $X = xP$
- Point addition 
- Modular arithmetic
- Integer Arithmetic

## 8.5 Elliptic Curve Digital Signature Algorithm
`ECDSA domain parameters` :
- Elliptic curve $E$ defined over $\mathbb{Z}_p$
- $n = \#E(\mathbb{Z}_p)$, where $n$ is prime
- A generator $P \in E(\mathbb{Z}_p)$
- A collision-resistant hash function $H$ whose output has the same bitlength as $n$ (e.g. $H = \text{SHA256}$)

`ECDSA key generation` : Alice does :
- Select $a \in_R [1, n-1]$ and compute $A = aP$
- Alice's `public key` is $A$; her `private key` is $a$

`Note` : Compupting $a$ from $A$ is an instance of the ECDLP

### ECDSA : Signature generation
`ECDSA signature generation` : To sign a message $M \in \{0, 1\}^*$, Alice does :
- Compute $m = H(M)$ and interpret $m$ as an integer
- Select a `per-message secret` $k \in_R [1, n-1]$
- Compute $R = kP$. Let $r = x(R) \mod{n}$ and check that $r \neq 0$ ($x(R)$ is the $x$-coordinate of $R$)
- Compute $s = k^{-1}(m + ar) \mod{n}$, and check that $s \neq 0$
- Alice's signature on $M$ is $(r, s)$

`Notes` : 
- $k$ should be securely deleted after it has been used
- Also, a fresh random $k$ should be generated each time Alice signs a message

### Determministic ECDSA
ECDSA is a `randomized` signature scheme, since a new per-message secret key $k$ is generated for each message that is signed

ECDSA can be made `deterministic` as follows :
- Alice has a second long-term secret key $b \in_R \{0, 1\}^{256}$
- When signing a message $M$, instead of selecting per-message secret key $k$ at random, Alice computes $k = H(b, M)$ where $H$ is a hash function whose range is uniformly distributed in $[1, n-1]$
- Note that the same $k$ is used each time Alice signs a particular message $M$

### ECDSA : Signature verification
`ECDSA signature verification` : To verify Alice's signature $(r, s)$ on $M$, Bob does :
- Obtain an authentic copy of Alice's public key $A$
- Check that $r, s$ are integers in $[1, n-1]$
- Compute $m = H(M)$
- Compute $u_1 = ms^{-1} \mod{n}$ and $u_2 = rs^{-1} \mod{n}$
- Compute $V = u_1P + u_2A$ and verify that $V \neq \infty$
- Compute $v = x(V) \mod{n}$
- Accept $(M, (r, s))$ if and only if $v = r$

`Note` : If Alice did indeed generate $(M, (r, s))$, then Bob will accept

### ECDSA Notes
`Security` : ECDSA is believed to be *secure*, assuming that ECDLP is intractable and $H$ is a `secure` hash function

`ECDSA (with 256-bit $p$) versus RSA (with 3072-bit $n$)` :
- In practice, RSA is used with $e = 3$ or $e = 2^{16} + 1$
    So, RSA signature verification ($s^e \mod{n}$) is generally faster than ECDSA signature verification ($V = u_1P + u_2A$)
- RSA signature generation ($H(M)^d \mod{n}$) is generally slower than ECDSA signature generation ($R = kP$)
- RSA signatures are `3072-bits` in length, whereas ECDSA signatures are `512 bits` in length

### Performance
`ECDSA with P-256` :
- signature generations per second : ~840
- signature verification per second : ~420

`RSA with 2048-bit $n$ and $e = 65537$` :
- signature generations per second : ~210
- signature verification per second : ~2533