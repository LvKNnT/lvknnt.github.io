---
title: "[CS432] Cryptography - Lab 2"
date: 2026-11-16
description: "Lab 2"
series: "Cryptography Course - Lab"
seriesOrder: 2
---

# LAB 2

You can access to the course labs [here](https://cryptography101.ca/wp-content/uploads/Lab2.pdf) and solutions [here](https://cryptography101.ca/wp-content/uploads/Solutions2.pdf) so this is just my own notes :

- 1 : CBC encryption
- 2 : Composing a hash function with itself
- 3 : hash functions
- 4 : EMAC
- 5 : Hash functions
- 6 : Iterated hash functions
- 7 : MAC schemes

# CBC encryption 
Recall that AES is a block cipher with plaintext and ciphertext blocks of length 128 bits, and key space $\{0, 1\}^{128}$. Plaintext messages $m$ that are longer that 128 bits are broken into blocks : $m = (m_1, m_2, \dots, m_t)$ where each block $m_i$ is 128 bits long. In the CBC mode of operation, $m$ is encrypted by first selecting $c_0 \in_R \{0, 1\}^{128}$ and then computing $c_i = \text{AES}_k(m_i \oplus c_{i-1})$ for $1 \le 1 \le t$; the ciphertext is 128 bits long. In the CBC mode of operation, $m$ is encrypted by first selecting $c_0 \in_R \{0, 1\}^{128}$ and then computing $c_i = \text{AES}_k(m_i \oplus c_{i-1})$ for $1 \le i \le t$; the ciphertext is $c = (c_0, c_1, \dots, c_t)$. (Note that a new $c_0$ is selected each time a message is encrypted)

Show that CBC encryptions is *not* semantically secure against a *chosen-ciphertext attack*

## Solutions
Suppose that the adversary observes a ciphetext $c = (c_0, c_1, \dots, c_t)$, and suppose that the corresponding plaintext is $m = ( m_1, m_2, \dots, m_t)$. The adversary flips the first bit of $c_0$ to obtain $c_0'$ and then presents $c' = (c_0', c_1, \dots, c_t)$ to the decryption oracle. Note that $c' \neq c$, so this is legitimate orcale query. She receives $m' = (m_1', m_2, \dots, m_t)$ from the oracle, where $m_1'$ only differs from the $m_1$ in the first bit. So, by flipping the first bit of $m_1'$, the adversary recovers $m$. This shows that CBC encryption is not semantically secure against chosen-ciphertext attack

# Composing a hash function with itself
Let $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ *$ be a hash function. Define a new hash function $G : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ by $G(x) = H(H(x))$
1. Prove that if $H$ is collision resistant, then $G$ is also collision resistant
2. Prove that if $H$ is preimage resistant, then $G$ is also preimage resistant

(Note : As mentioned in class, such statements should be proven using the contrapositive statements)

## Solutions
1. Suppose that $G$ is not collision resistant. We will show that $H$ is not collision resistant.

Since $G$ is not collision resistant, we can *efficiently* find distinct $x, x' \in \{0, 1\}^*$ for which $G(x) = G(x')$. Now compute $y = H(x)$ and $y' = H(x')$. Because $G(x) = H(H(x))$, we have $H(y) = H(y')$.

If $y \neq y'$ then $y, y'$ is a collision for $H$ that we have efficiently found. Hence $H$ is not collision resistant

If $y = y'$, then we have $H(x) = H(x')$ and so $x, x'$ is a collision for $H$ that we have efficiently found. Again, we conclude that $H$ is not collision resistant

2. Suppose that $G$ is not preimage resistant. We will show that $H$ is not preimage resistant. 

Suppose we are given a $y \in_R \{0, 1\}^n$. Since $G$ is not preimage resistant, we can efficiently find an $x \in \{0, 1\}^*$ such that $G(x) = y$. Now, $G(x) = H(H(x))$. So, letting $x' = H(x)$, we have $H(x') = y$. Thus we have efficiently found an $x' \in \{0, 1\}^*$ such that $H(x') = y$. Thus $H$ is not preimage resistant

# Hash functions
Let $H$ be an iterated hash function with compression function $f : \{0, 1\} ^ {n + r} \rightarrow \{0, 1\} ^ n$ (See slide 3.30 for a complete description of an iterated hash function.) Suppose that you are given al algorithm $\mathcal{A}$ which, on input $z \in \{0, 1\} ^ n$, finds $s, t \in \{0, 1\}^r, s \neq t$, such that $f(z, s) = f(z, t)$. Suppose that the running time of $\mathcal{A}$ is $T$. Let $d$ be a positive integer, ad let $D = 2^d$. Show how $\mathcal{A}$ can be used to find, in time approximately $dT$ (not including the time to write down the messages), $D$ pairwise distinct messages $m_0, m_1, \dots, m_{D-1}$ sucht that $H(m_0) = H(m_1) = \dots = H(m_{D-1})$

## Solutions
Consider the following algorithm :
1. Let $I_0 = IV$, where $IV$ is the initialization vector in the definition of $H$. 
2. Use algorithm $\mathcal{A}$ to find $A_0, B_0 \in \{0, 1\}^r$, with $A_0 \neq B_0$, such that $f(I_0, A_0) = f(I_0, B_0)$. 
3. For $i$ from 1 to $d-1$ do the following :
- Compute $I_i = f(I_{i-1}, A_{i-1})$. (Note that $I_i = f(I_{i-1}, B_{i-1}))$
- Use algorithm $\mathcal{A}$ to find $A_i, B_i \in \{0, 1\}^r$, with $A_i \neq B_i$, such that $f(I_i, A_i) = f(I_i, B_i)$

The running time of this algorithm is approximately $dT$ since $\mathcal{A}$ is invoked $d$ times

Now for each integer $j, 0 \le j \le D - 1$, define a message $m_j$ as follows : Let $(j_{d-1}, \dots, j_2, j_1, j_0)$ be the $d$-bit for binary representation of $j$. Then $m_j = C_0 || C_1 || \dots || C_{d-1}$, where $C_i = A_i$ if $j_i = 0$ and $C_i = B_i$ if $j_i = 1$

Note that the $D$ message $m_0, m_1, \dots, m_{D-1}$ are distinct (since $A_i \neq B_i$ for each $0 \le i \le d-1$). By induction on $i$, processing any choice of blocks $C_0, \dots, C_{i-1}$ yields chaining value $I_i$, since $f(I_{i-1}, A_{i-1}) = f(I_{i-1}, B_{i-1})$. In particular, every $m_j$ yields chaining value $I_d = f(I_{d-1}, A_{d-1})$ after its $d$ message blocks. Moreover, they all have bitlength $dr$ and so their length blocks are the same. It follows that $H(m_0), = H(m_1) = \dots = H(m_{D-1})$ 

# EMAC 
Consider the variant of EMAC (as described on slide 4.20 for authenticating messages of variable block lengths) where $n = \ell$ and $MAC_{k,s}(x) = CBC-MAC_k(x) \oplus s$. Is this MAC scheme secure ? (Justify your answer)

## Solutions
The MAC scheme is insecure, and this can be demonstrated in many ways. Here is one attack :
1. Select a one-block message $x_1 \in \{0, 1\}^n$ and obtain its tag $t_1 = E_k(x_1) \oplus s$ 
2. Obtain the tag $t_2$ of the two-block message (x_1, t_1) : t_2 = E_k(E_k(x_1) \oplus t_1) \oplus s$
3. Select a one-block message $x_2 \in \{0, 1\}^n$, with $x_2 \neq x_1$, and obtain its tag $t_3 = E_k(x_2) \oplus s$
4. Output $x^* = (x_2, t_3)$ and $t^* = t_2$

*Correctness* : Note that 
$$
t_2 = E_k(E_k(x_1) \oplus t_1) \oplus s = E_k(E_k(x_1) \oplus E_k(x_1) \oplus s) \oplus s = E_k(s) \oplus s
$$
Similarly, the tag of $x^* = (x_2, t_3)$ is 
$$
t^* = E_k(E_k(x_2) \oplus t_3) \oplus s = E_k(E_k(x_2) \oplus E_k(x_2) \oplus s) \oplus s = E_k(s) \oplus s = t_2
$$

Thus, $(x^*, t^*)$ is a valid message-tag pair. Furthermore, since $x_2 \neq x_1$, the tag of $x^*$ wasn't requested in (1), (2), and (3). Thus $(x^*, t^*)$ is a valid message-tag forgery.

# Hash functions
Let $F : \{0, 1\}^* \rightarrow \{0, 1\}^{256}$ be a hash function, and let $c \in \{0, 1\}^{256}$ be a fixed string ($c$ is a universal constant). Define $H : \{0, 1\}^* \rightarrow \{0, 1\}^{256}$ by $H(x) = F(c || F(c || x))$
1. Suppose that $F$ is collision resistant. Is $H$ colission resistant? (Justify your answer)
2. Suppose that $F$ is preimage resistant. Is $H$ preimage resistant? (Justify your answer)

## Solutions
1. Yes, $H$ is collision resistant

*Proof*: Suppose that $H$ is not collision resistant. The nwe can efficiently find $x_1, x_2 \in \{0, 1\}^*$ with $x_1 \neq x_2$ and $H(x_1) = H(x_2)$, hence $F(c || F(c || x_1)) = F(c || F(c || x_2))$. Now, if $F(c || x_1) = F(c || x_2)$, then $(c || x_1, c || x_2)$ is a collision for $F$ that we have efficiently found. And if $F(c || x_1) \neq F(c || x_2)$, then $(c || F(c || x_1), c || F(c || x_2))$ is a collision for $F$ that we have efficiently found. In either case, we have efficientlt found a collision for $F$, so $F$ is not collision resistant.

2. Yes, $H$ is preimage resistant

*Proof* : Suppose that $H$ is not preimage resistant. Suppose we are given $y \in_r \{0, 1\}^{256}$. Since $H$ is not preimage resistant, we can efficiently find $x \in \{0, 1\}^*$ with $H(x) = y$. Hence, $F(c || F(c || x)) = y$. We can compute $x' = c || F(c || x)$ and then $F(x') = y$. Hence, $x'$ is an $F$-preimage of $y$ that we have efficiently found, so $F$ is not preimage resistant


# Iterated hash functions
Recall Merkle's construction for iterated hash functions $H$. Here, $IV \in \{0, 1\}^n$ is a fixed initializing value, and $f : \{0, 1\}^{n+r} \rightarrow \{0, 1\}^n$ is a collision-resistant compression function. To compute $H(x)$ where $x$ has bitlength $b < 2^r$ one does the following :
- Break up $x$ into $r$-bit blocks $\bar{x} = x_1, x_2, \dots, x_t$, padding out the last vlock with 0 bits if necessary
- Define the length block $x_{t+1}$ to be the right-justified binary representation of $b$
- Let $H_0 = IV$
- Compute $H_i = f(H_{i-1}, x_i)$ for $i = 1, 2, \dots, t+1$
- Then $H(x) = H_{t+1}$

1. Consider the hash function $F_1$ obtained bu omitting the length block. So, $F_1(x) = H_t$. Is $F_1$ collision resistant ? (Justify your answer)
2. Consider the hash function $F_2$ defined by $F_2(x) = H_t || x_{t+1}$. Is $F_2$ collision resistant ? (Justify your answer)
3. Suppose that $n = r$, and suppose that all messages $x$ have bitlength $b > n$. Consider that hash function $F_3$ obtained by modifying $H$ so that the first message block $x_1$ is used as the $IV$. Is $F_3$ collision resistant ? (Justify your answer)

## Solutions
1. No

*Justification* : Let $x$ be any mesage whose bitlength is not a multiple of $r$, and let $x' = x || 0$. After padding with 0 bit, $x$ and $x'$ have the same blocks $x_1, \dots, x_t$, so $F_1(x) = F_1(x')$ with $x \neq x'$. Thus, collisions for $F_1$ can be efficiently found

2. Yes

*Proof* : Suppose that we can efficiently find $x \neq x'$ with $F_2(x) = F_2(x')$. Then $H_t = H'_{t'}$ and $x_{t+1} = x'_{t' + 1}$. Hence $x$ and $x'$ have the same bitlength, so $t = t'$ and the padded blocks $(x_1, \dots, x_t)$ and $(x'_1, \dots, x'_t)$ are distinct

Since the apdded blocks differ, there is a largest index $j$ with $1 \le j \le t$ and $(H_{j-1}, x_j) \neq (H'_{j-1}, x'_j)$. By the maximality of $j$ (or by $H_t = H'_t$ if $j = t$), $H_j = H'_j$, so $f(H_{j-1}, x_j) = f(H'_{j-1}, x'_j)$ is a collision of $f$. Finding it takes $2t$ evaluations of $f$, which is efficient. Hence $f$ is not collision resistant

3. Yes

*Proof* : We have $H_1 = x_1, H_i = f(H_{i-1}, x_i)$ for $2 \le i \le t+1$, and $F_3(x) = H_{t+1}$. Suppose that we can efficiently find $x \neq x'$ with $F_3(x) = F_3(x')$, that is, $f(H_t, x_{t+1}) = f(H'_t, x'_{t'+1})$. If $x$ and $x'$ have different bitlengths, then $x_{t+1} \neq x'_{t'+1}$, and this is a collision for $f$. Otherwise the argument of (2) applies, with $H_1 = x_1$ in place of $IV$. It produces a collision for $f$ unless $x_j = x'_j$ for $2 \le j \le t$ and $H_1 = H'_1$, that is unless all blocks agree, which is impossible. Hence $f$ is not collision resistant

# MAC schemes
Consider the following MAC scheme for authenticating fixed-length messages from $\{0, 1\}^{256}$. For each $i, 1 \le i \le 128$, let $S_i$ be a fixed subset of ${1, 2, \dots, 256}$. The key space is $\{0, 1\}^{128}$ To authenticate a message $m$ with key $k$, one first forms the 128-bit string $b = b_1 b_2 \dots b_{128}$ where $b_i$ is the sum modulo 2 of the bits of $m$ indexed by the elements of $S_i$, and then AES-encrypts $b$ with key $k$. The resulting ciphertext $c$ is the tag on $m$. 

Show how a passive adversary who is given a single valid message/tag pair can easily produce new valid message/tag pairs. (Note : By a "passive" adversary we mean one who does not have access to a MACing oracle)

## Solutions
*Remark* This exercise shows that linearity can be dangerous in cryptography algorithms

Let $A$ be the $128 \times 256$ binary matrix whose $(i, j)$ entry is 1 if $j \in S_i$ and 0 if $j \notin S_i$. Then the MAC algorithm can be describe as follows : the tag for a message $m ]in \{0, 1\}^{256}$ is $c = \text{AES}_k(b)$, where $b = Am$

Now, suppose the adversary is given a valid message/tag pair $(m, c)$ (and the adversaru doesn't know the secret key $k$). Since the matrix $\mathcal{A}$ has rank at most 128, its null space (that is, all binary vectors $x$ satisfying $Ax = 0$) has dimension at least 128. Let $x$ be any nonzero vector in the null space of $A$; the adversary can efficiently find such as $x$ by using Gaussian elimination. Then $(m + x, c)$ is also a valid message/tag pair since $A(m + x) = Am + Ax = Am = b$. Since the adversary can efficiently compute this message/tag pair, the MAC scheme is insecure.