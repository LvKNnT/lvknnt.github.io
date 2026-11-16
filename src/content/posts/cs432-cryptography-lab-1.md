---
title: "[CS432] Cryptography - Lab 1"
date: 2026-11-16
description: "Lab 1"
series: "Cryptography Course - Lab"
seriesOrder: 1
---

# LAB 1

You can access to the course labs [here](https://cryptography101.ca/wp-content/uploads/Lab1.pdf) and solutions [here](https://cryptography101.ca/wp-content/uploads/Solutions1.pdf) so this is just my own notes :

- 1 : Linear (and affine) encryption schemes are insecure
- 2 : ChaCha20 
- 3 : Meet-in-the-middle attack on Double-DES 
- 4 : AES encryption 
- 5 : Triple-DES 
- 6 : Strengthening DES
- 7 : AES operations

# Linear (and affine) encryption schemes are insecure
Let $n \ge 2$ be an integer. Let $A$ be invertible $n \times n$ binary matrix, and let $b$ be a $1 \times n$ binary vector. In the Hill symmetric-key encryption scheme, the secret key is a pair $(A, b)$. Plaintext messages $m$ are represented as $1 \times n$ binary vectors. The encyrption function is $E(m) = mA + b$

> Note : All arithmetic is preformed modulo 2. You may assume that linear algebra "works" modulo 2

Here is a toy exmaple with $n = 5$ : 
$$
A = \left[
\begin{array}{ccccc}
1 & 0 & 0 & 0 & 1 \\
0 & 1 & 0 & 1 & 1 \\
0 & 0 & 1 & 1 & 0 \\
0 & 1 & 0 & 1 & 0 \\
0 & 0 & 1 & 0 & 1
\end{array}
\right],
\quad
b = [1,1,0,1,1],
\quad
m = [1,0,1,0,1],
\quad
\text{and}
\quad
E(m) = [0,1,0,0,1].
$$

1.  Give a decryption formula for the Hill cipher (with general parameter $n$)

2. Show how an adversary can efficiently determine the secret key $(A, b)$ using a *chosen-plaintext* attack

3. In a *chosen-ciphertext* attack, the adversary is given a challenge ciphertext $c$. She can obtain (by asking Alice or Bob, who know the secret key) the plaintext of *any* ciphertext of her choice *except for c itself*. Her task is to decrypt *c*

    Show how the adversary can decrypt $c$ obtaining the decryption of at most 3 ciphertexts (each different from $c$) from Alice or Bob.

## Solutions 
> Remark : This exercise shows (1) that linear (and affine) operations are not desirable in encryption schemes from a security point of view; and (2) that chosen-plaintext and chosen-ciphertext attacks can be very powerful

1. A ciphertext $c$ can be decrypted using the formula $m = (c + b) A ^{-1}$

2. The adversary first obtain $b$ as the encryption of the plaintext $m = 0$. She then obtains the encryption $c_i$ of the unit vectorrs $m_i$ for $1 \le i \le n$, where $m_i$ denotes the vector with a 1 in position $i$ and o's in other positions. Since $c_i = m_i A + b$, we have the $c_i$ is the sum of the $i$th row of $A$ with $b$. Thus, $c_i + b$ is the $i$th row of $A$. In this way, the adversary can easily compute $(A, b)$ after obtaining the ciphertexts of $n+1$ plaintexts of her choosing

3. The adversary selects $c_1, c_2$ and $c_3$ so that $c = c_1 + c_2 + c_3$ and $c \neq c_1, c \neq c_2, c \neq c_3$. If $c \neq 0$, she does this by selecting $c_1 = 0$, selecting $c_2$ to be an arbitrary nonzero vector different from $c$, and setting $c_3 = c + c_2$. If $c = 0$, she can select $c_1 = (1, 0, \dots, 0), c_2 = (0, 1, 0, \dots, 0)$, and $c_3 = (1, 1, 0, \dots, 0)$. She then obtains from Bob the plaintexts $m_1, m_2$ and $m_3$, corresponding to $c_1, c_2$ and $c_3$. Since :
$$
\begin{aligned}
m_1 + m_2 + m_3
&= (c_1 + b)A^{-1} + (c_2 + b)A^{-1} + (c_3 + b)A^{-1} \\
&= (c_1 + c_2 + c_3)A^{-1} + (b + b + b)A^{-1} \\
&= cA^{-1} + bA^{-1},
\end{aligned}
$$
she recovers the decryption $m$ of the target ciphertext $c$ by computing $m = m_1 + m_2 + m_3$

# ChaCha20
1. Show that the ChaCha20 quarter round function $QR : \{0, 1\} ^ {128} \rightarrow \{0, 1\} ^ {128}$ (defined on the slides 2.36) is invertible

2. Consider `ChaCha20-new-and-improved`, a variant of ChaCha20 where the instruction "Output $S \boxplus S'$ is replaced with the instruction "Output $S$". Show that `ChaCha20-new-and-improved` is *totally insecure under a *known-plaintext attack*

    (You should recall the security notions for symmetric-key encryption shcemes on slides 2.14 and 2.15)

## Solutions
1. The quarter round function $QR$ is a sequence of 12 instructions, each of which is invertible :
- The inverse of $a \mapsto a \lll t$ is $a \mapsto a \ggg t$
- The inverse of $(a, b) \mapsto (a \oplus b, b)$ is $(a, b) \mapsto (a \oplus b, b)$
- The inverse of $(a, b) \mapsto (a \boxplus b, b)$ is $(a, b) \mapsto (a - b \mod{2 ^ {32}}, b)$

It follows that QR can be inverted by applying the inverses of the 12 instructions, in the reverse order as given in the description of $QR$.

2. Suppose that we are given the first 64 bytes $m$ of a plaitnext and the corresponding ciphertext $c$. We then compute the `ChaCha20-new-and-improved` keystream bytes $S = m \oplus c$. Since QR is invertible, we can apply the inverses of the 80 QR invocations in the reverse order as given in the description of ChaCha20 keystream generation. This will yield the initial state S', from which we can immediately extract the secret key $k$. This, `ChaCha20-new-and-improved` is totally insecure under a known-plaintext attack.

# Meet-in-the-middle attack on Double-DES
In this question, you have to assume that the total amount of storage space available is 1,000 Terabytes ($\approx 2^{53} bits$)

1. Describe a known-plaintext meet-in-the-middle attack on Double-DES that recovers the secret key. You should justify the correctness of the algorithm, estimate the expected number of DES operations the algorithm takes, and justify that the algorithm requires at most 1,000 Terabytes of storage. (A *DES operation* is a single-DES encryption or a single-DES decryption.) Of course, you should design your algorithm to be as fast as you can.
2. Suppose that you have access to a network of 1,000 computers, each computer capable of performing 5,000,000 DES operations per second. The computers have access to shared storage, and you can assume for simplicity that accessing this storage takes negligible time. Estimate the expected number of calendar years your algorithm takes when run on this network. Compare this to the estimated number of calendar years your algorithm takes when run on this network. Compare this to the setimated number of calendar years that exhaustive key search on Double-DES would take when run on the same network

## Solutions
We assume that we have three plaintext-ciphertext pairs $(m_1, c_1), (m_2, c_2), (m_3, c_3)$ that were generated using the secret key $k = (k_1, k_2)$. Our task is to find $(k_1, k_2)$. In the following, $E$ denotes the single-DES encryption function. 

1. Repeat the following for each $r \in \{0, 1\}^{10}$ :
    - For each $s \in \{0, 1\} ^ {46}$ do :
        - Let $h_2 = r || s$
        - Compute $E_{h_2}^{-1}(c_1)$, and store $[E_{h_2}^{-1}(c_1), s]$ in a table sorted by first column
    - For each $h_1 \in \{0, 1\}^{56}$ do the following :
        - Compute $E_{h_1}(m_1)$
        - Search for $E_{h_1}(m_1)$ in the table
        - For each *match* $[E_{h_2}^{-1}(c_1), s]$ in the table, check if $E_{h_2}(E_{h_1}(m_2)) = c_2)$ and, if so, check if $E_{h_2}(E_{h_1}(m_3)) = c_3$, where $h_2 = r || s$. If both checks pass, then output $(h_1, h_2)$ and STOP

*Correctness* : The algorithm searches through all possibilities of $(h_1, h_2) \in \{0, 1\}^{56} \times \{0, 1\} ^ {56}$ until it finds a pair $(h_1, h_2)$ satisfying $c_i = E_{h_2}(E_{h_1}(m_i))$ for $i = 1,2,3$. We justified in class that it is virtually certain that this pair $(h_1, h_2)$ is the secret key $(k_1, k_2)$. Hence the algorithm will (with very high probability) find the secret key

*Space requirements* : Each entry of the table has length $64 + 46 = 110$ bits. The table has $2^{46}$ entries, so the total space requirements are $110 \times 2^{46} \approx 2^{52.8}$ bits. This is less than the total amount of space available, namely $2 ^ {53}$ bits

*Time* : For each iteration of the main loop (that is, for each $r \in \{0, 1\}^{10}$), step 1 requires $2 ^ {46}$ DES operations, and step 2(1) requires $2 ^ {56}$ DES operations. As explained in the class, the expected number of matches in step 2(3) over *all* iterations of the main loop is $2 ^ {48}$. Thus the total number of times that $c_2 = E_{h_2}(E_{h_1}(m_-2))$ is checked in step 2(3) over all iterations of the main loop is approximately $2 ^ {48}$. And, the total number of times that $c_3 = E_{h_2}(E_{h_1}(m_3))$ is checked in the step 2(3) is approximately 1. Since the secret key is expected to be encountered after checking half of all possible keys, the expected number of DES operations is $2 ^ 9 ( 2 ^ {46} + 2^{56}) + 2 \cdot 2^{47} \approx 2^{65}$

2. The algorithm described in (1) can be effectively parallelized. In step 1, each computer processes a subset of the $s \in \{0, 1\}^{46}$. Similarly in steps 2, each computer processes a subset of the $h_1 \in \{0, 1\} ^ {56}$. The computers share the storage space. The calendar time taken by the network of computers is thus approximately
$$
\frac{2 ^ {56}}{10 ^ 3 \times 5 \cdot 10^6 \times 60 \times 60 \times 24 \times 365} \approx 234 \text{years}
$$

Exhausetive search can also be effectively parallelized by having each computer search through a subset of the key space. The expected number of single-DES operations is $2 ^ {112}$, which works out to $3.3 \times 10^{16}$ calendar years

Both computations are infeasible on the available network. However, the meet-in-the-middle attac kis not infeasible by a large factor, which means that it would be within reach of a well-resourced adversary (more computers available, faster computers, and a bit more storage space). On the other hand, exhaustive key search is completely infeasible.

# AES encryption
Suppose that AES-128 is modified by omitting the `ShiftRows` operation. Describe an attack that *totally breaks* this variant of AES-128 under a *chosen-plaintext attack*. Analyze your attack with regard time, space, and number of chosen plaintexts

## Solutions
Since the `ShiftRows` instruction has been omitted, the modified AES encryption does not mix up bits from different columns of the plaintext. Thus, encryption of a plaintext block $(m_1, m_2, m_3, m_4)$, where $m_i \in \{0, 1\}^{32}$ are the four columns of $m$, can be described as 
$$
E_k((m_1, m_2, m_3, m_4)) = (E_{1, k}(m_1), E_{2,k}(m_2), E_{3,k}(m_3), E_{4,k}(m_4)),
$$
where each $E_{i,k} : \{0, 1\}^{32} \rightarrow \{0, 1\}^{32}$ is an invertible function

*Attack*:
- Create four decryption table $D_i : \{0, 1\}^{32} \rightarrow \{0, 1\}^{32}$ as follows : For each $a \in \{0, 1\}^{32}$, obtain the ciphertext $E_k((a, a, a, a)) = (z_1, z_2, z_3, z_4)$ from the encryption oracle, and add the table entries $D_1(z_1) = a, D_2(z_2) = a, D_3(z_3) = a, D_4(z_4) = a$
- Subsequently, when a ciphertext $c = (c_1, c_2, c_3, c_4)$ is encountered, tha tables can be used to determine the plaintext $(D_1(c_1), D_2(c_2), D_3(c_3), D_4(c_4))$

*Analysis* : The attack uses $2^{32}$ chosen plaintexts. The running time of the attack is $2^{32}$ encryption oracle queries. The storage required is $4 \times 2^{32} \times 32 = 2^{39}$ bits, or 64 Gigabytes

# Triple-DES
Recall that DES is a block cipher with key space $K = \{0, 1\}^{56}$, plaintext space $M = \{0, 1\} ^ {64}$, and ciphertext space $C = \{0, 1\}^{64}$

Recall that Triple-DES has key space $K = \{0, 1\} ^ {168}$. A plaintext $m \in \{0, 1\}^{64}$ is encrypted under key $k = (k_1, k_2, k_3)$ (where $k_1, k_2, k_3 \in_R \{0, 1\}^{56}$) as follows :
$$
E_k(m) = DES_{k_3}(DES_{k_2}(DES_{k_1}(m)))
$$

1. For Triple-DES, how many known plaintext-ciphertext pairs are sufficient in order to uniquely determine the secret key with high probability? (Justify your answer)
2. Describe a *known-plaintext attack* on Triple-DES that is signigicantly faster than exhaustive key search, and uses no more than $2^{64}$ bytes of storage. Estimate the time and space requirements of your attack.

## Solutions 
1. For Triple-DES, the keylength is $\ell = 168$ and the block length is $L = 64$. Using the heuristic argument presented in class, the expected number of false keys for $t$ plaintext-ciphertext pairs is $\text{FK} = 2 ^ {168} / 2 ^ {64t}$. For $t = 1,2,3,4$, the values of FK are $2 ^ {104}, 2 ^ {40}, 2 ^ {-24}$ and $2 ^ {-88}$. Hence $t = 4$ plaintext-ciphertext pairs will be sufficient to uniquely determine the secret key with very high probability ($t = 3$ pairs are also sufficient)
2. Suppose we are given $t = 4$ plaintext-ciphertext pairs $(m_1, c_1), (m_2, c_2), (m_3, c_3)$, and $(m_4, c_4)$ which were generated using the secret key $(k_1, k_2, k_3)$. The meet-in-the-middle attack uses the identity : $E_{k_3}^{-1}(c) = E_{k_2}(E_{k_1}(m))$:
    - For each $h_3 \in \{0, 1\}^{56}$, compute $E_{h_3}^{-1}(c_1)$, and store $(E_{h_3}^{-1}(c_1), h_3)$ in a table sorted by first component
    - For each $(h_1, h_2) \in \{0, 1\} ^ {56} \times \{0, 1\} ^ {56}$ do :
        - (A) Compute $E_{h_2}(E_{h_1}(m_1))$ and look for this in the table
        - (B) For each match, say $E_{h_2}(E_{h_1}(m_1)) = E_{h_3}(-1)(c_1)$, do :
            - (C) If $E_{h_3}(E_{h_2}(E_{h_1}(m_2))) = c_3$ then :
                - (D) If $E_{h_3}(E_{h_2}(E_{h_1}(m_3))) = c_2$ then :
                    - (E) If $E_{h_3}(E_{h_2}(E_{h_1}(m_4))) = c_4$ then :
                        - Output $(k_1, k_2, k_3) = (h_1, h_2, h_3)$ and STOP 

*Analysis* :

*Time* : The number of DES operations is at most :
$$
2 ^ {56} + 2 \cdot 2^{112} + 3(2 ^ {104} + 2 ^ {40}) \approx 2^{113}
$$
($3(2^{104} + 2 ^ {40}))$ is approxiamtely the extra work due to false key matches in steps (C) and (D).)
 
*Space requirements* : $2^{56} \cdot (64 + 56) \approx 2^{63} \text{ bits} \approx 1 \text{ exabyte}$

# Strengthening DES
Recall that DES is a symmetric-key encryption scheme with a 56-bit key size, and 64-bit plaintext and ciphertext blocks

1. Consider the following proposal for a symmetric-key encryption scheme based on DES. The secret key for the new scheme is $k = (k_1, k_2)$, where $k_1 \in_R \{0, 1\}^{56}$ and $k_2 \in_R \{0, 1\}^{64}$ (so $k$ is a 120-bit key). Let $m \in \{0, 1\} ^ {64}$ be a plaintext message. Then encryption is defiend as follows :  $E_k(m) = DES_{k_1}(m) \oplus k_2$

    Give a formula for the decryption function

2. Show how the encryption scheme defined in (1) can be totally broken - that is, the secret key $k$ can be recovered - by a known-plaintext attack whose total running time is *roughly* $2 ^ {56}$ DES encryption/decryption operations. Your attack should use very little space. You may assume that you have a moderate number of known plaintext-ciphertext pairs ($m_i, c_i = E_k(m_i)$)
3. Consider the following proposal for a symmetric-key encryption scheme based on DES. The secret key for the new scheme is $k = (k_1, k_2, k_3)$, where $k_1 \in_R \{0, 1\}^{56}, k_2 \in_R \{0, 1\}^{64}$, and $k_3 \in_R \{0, 1\}^{64}$ (so $k$ is a 184-bit key). Let $m \in \{0, 1\}^{64}$ be a plaintext message. Then encryption is defined as follows : $E_k(m) = DES_{k_1}(m \oplus k_3) \oplus k_2$

    Describe and analyze the fastest known-plaintext attack you can find on this encryption scheme. (You may assume that you have an unlimited amount of storage, and that accessing this storage takes negligible time).
    
    Would you consider this encryption scheme to be secure against key recovery attacks? (Explain)

## Solutions
1. $m = \text{DES}_{k_1}^{-1}(c \oplus k_2)$
2. Suppose that we have three plaintext-ciphertext pairs $(m_1, c_1), (m_2, c_2)$, and $(m_3, c_3)$. If we assume that each $E_k$ is a random function, then the expecxted number of false keys that satisfy $E_k(m_i) = c_i$ for $i = 1,2,3$ is $(2 ^ {120} - 1) / 2 ^ {192} \approx 0$
The secret key $k$ can be determined as follows. For each $h_1 \in \{0, 1\}^{56}$, set $h_2 = \text{DES}_{h_1}(m_1) \oplus c_1$ and check if $\text{DES}_{h_1}(m_2) \oplus h_2 = c_2$; if so, then check if $\text{DES}_{h_1}(m_3) \oplus h_2 = c_3$. If the latter check passes, then with high probability $(h_1, h_2)$ is the secret key.

The expected number of DES operations is $2 ^ {56}$. The storage requirements are negligible
3. Suppose that we have each $E_k$ is a random function, then the expected number of false keys that satisfy $E_k(m_i) = c_i$ for $i = 1, 2,3,4$ is $(2 ^ {184} - 1) / 2 ^ {256} \approx 0$

The secret key $k$ can be determined as follows. For each $(h_1, h_3) \in \{0, 1\}^{56} \times \{0, 1\}^{64}$, set $h_2 = \text{DES}_{h_1}(m_3 \oplus h_3) \oplus c_1$ and check if $\text{DES}_{h_1}(m_2 \oplus h_3) \oplus h_2$; if so, then check if $\text{DES}_{h_1}(m_3 \oplus h_3) \oplus h_2 = c_3$; if so, then check if $\text{DES}_{h_1}(m_4 \oplus h_3) \oplus h_2 = c_4$. If the last check passes, then with high probability $(h1, h2, h3)$ is the secret key

The expected number of DES operations is $2 ^ {120}$

If this is the fastest key recovery attack tha twe can find, then we might conclude that the encryption scheme is *secure* against key recovery attack

*Remark* : This variant of DES is called DESX, and was proposed by Ron Rivest in 1984. As it turns out, the fastest key recovery attack known on DESX is a known-plaintext "slide attack" that requires $2 ^ {32.5}$ knwon plaintext-ciphertext pairs, and $2 ^ {87.5}$ DES operations. The attack is described in Section 4 of the following article [https://link.springer.com/chapter/10.1007/3-540-45539-6](https://link.springer.com/chapter/10.1007/3-540-45539-6)

# AES operation 
You should attempt this question *by hand*. It's a bit tedious, but will confirm your understanding of the MixColumns operation

1. Compute $\textbf{ab} \times \textbf{ef}$ in $GF(2 ^ 8)$. Use the convention on slide 2.71 for the representation of $GF(2 ^ 8)$ elements
2. Consider the AES column $a = \textbf{00000000}$. Compute MixColumns($a$).
3. Consider the AES column $a = \textbf{fedcba09}$. Compute MixColumns($a$). You may use the following tables for multiplication in $GF(2^8)$ by $\textbf{02}$, multiplication in $GF(2 ^ 8)$ by $\textbf{03}$, and xor of hexadeciaml digits.

> Please checkout the table in original files

## Solutions
1. We have $a(y) = y^7 + y^5 + y^3 + y + 1$ andd $b(y) = y^7 + y^6 + y^5 + y^3 + y^2 + y + 1$. The product of $a(y)$ and $b(y)$ is $c(y) = y ^ {14} + y^{13} + y^{11} + y^{10} + y^5 + y^3 + 1$. The remainder upon dividing $c(y)$ by $f(y) = y^8 + y^4 + y^3 + y + 1$ is $y^6 +y^3+y$, or $\textbf{4a}$
2. The MixColumns operation is $\text{MixColumns}(a) = a(x)c(x) \mod{x^4 - 1}$. Thus MixColumns(00000000) = 00000000.
3. We have $a(x) = 01 + 01x + 01x^2 + 01x^3$ and $c(x) = 03x^3 + 01x^2 + 01x + 02$. Then
$$
a(x) \cdot c(x) = 03x^6 + 02x^5 + 03x^4 + 01x^3 + 02x^2 + 03x + 02
$$
Since $x^4 \equiv 1 \pmod{x^4 - 1}$, we can reduce this polynommial modulo $x^4 - 1$ by replacing $x^4$ by 1, $x^5$ by $x$, and $x^6$ by $x^2$. We get $01x^3 + 01x^2 + 01x + 01$, or 0101010101
4. We have $a(x) = 09x^3 + bax^2 + dcx + fe$ and $c(x) = 03x^3 + 01x^2 + 01x + 02$. Then 
$$
a(x) \cdot c(x) = 1bx^6 + dcx^5 + ccx^4 + 6dx^3 + 4dx^2 + 5dx + e7
$$
Since $x^4 \equiv 1 \pmod{x^4 - 1}$, we can reduce this polynommial modulo $x^4 - 1$ by replacing $x^4$ by 1, $x^5$ by $x$, and $x^6$ by $x^2$. We get $6dx^3 + 56x^2 + 81x + 2b$, or 2b81566d