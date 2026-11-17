---
title: "[CS432] Cryptography - Lab 3"
date: 2026-11-17
description: "Lab 3"
series: "Cryptography Course - Lab"
seriesOrder: 3
---

# LAB 3

You can access to the course labs [here](https://cryptography101.ca/wp-content/uploads/Lab3.pdf) and solutions [here](https://cryptography101.ca/wp-content/uploads/Solutions3.pdf) so this is just my own notes :
- 1 : AES-GCM
- 2 : An attack on an implementation of MAC schemes
- 3 : Algorithm analysis
- 4 : Computing GCDs without long division
- 5 : MACs
- 6 : Envelope encryption
- 7 : Analysis of the Euclidean algorithm

# AES-GCM
Suppose that an adversary obtains an AES-GCM ciphertext/tag $(IV, A, C, t)$ and the coressponding plaintext $M \in \{0, 1\}^{128u}$. Suppose also that the adversary is somehow be able to learn $H$. Let $(A', M')$ be such that $M'$ has blocklength $u' \le u$. Show how the adversary can compute a valid ciphertext/tag for $(A', M')$

(This exercise shows that maintaining the secrecy of $H$ is very important)

## Solutions 
Given $(IV, A, C, t)$, $M$ and $H$, the adversary does the following : 
- Let $L = L_A || L_C$ and $J_0 = IV || 0 ^ {31} || 1$
- Compute $\text{AES}_k(J_i) = C_i \oplus M_i$ for $1 \le i \le u$
- Compute $f_{A, C, L}(H)$ and $\text{AES}_k(J_0) = t \oplus f_{A,C,L}(H)$
- Select $(A', M')$, where the blocklength $u'$ of $M'$ is at most $u$
- Let $L' = L_{A'} || L_{C'}$
- Compute $C'_i = \text{AES}_k(J_i) \oplus M'_i$ for $1 \le i \le u'$
- Compute $t' = \text{AES}_k(J_0) \oplus f_{A', C', L'}(H)$
- Output $(IV, A', C', t')$

# An attack on an implementation of MAC schemes
Let MAC denote a deterministic MAC scheme such as HMAC with 256-bit keys $k$ and 256-bit tags $t$. ("Deterministic" means that no random bits are used when computing the tag of a message.) Consider the following tag verfication algorithm

> INPUT : A message $m$, a tag $t \in \{0, 1\} ^ {256}$, and a secret $k \in \{0, 1\}^{256}$

> OUTPUT : "Accept" or "Reject"

Compute $t' = \text{MAC}_k(m)$

> For $i$ from 1 to 256 do :
> - If the $i$th bit of $t$ is different from the $i$th bit of $t'$ then :
>   - Output "Reject" and stop
> 
> Output "Accept"

1. Suppose now that you have access to a *MAC verification oracle*; such an oracle executes the tag verification algorithm described above when presented with a message-tag pair (the oracle uses its own secret key $k$) and returns "Accept" or "Reject". Suppose also that you can obtain very precise measurements of the time that the MAC verification oracle takes. Describe an efficient attack that computes the tag of a message $m$ that is given to you. (Of course, you do not know the secret key $k$. You also do not have access to a MAC geenration oracle)

2. Propose a modification to the tag verification algorithm that defeats the attack

## Solutions
1. For a binary strong $x$ of lenght 256 and $1 \le i \le 256$, let $x ^ i$ dentoe the 256-bit string obtained by flipping the $i$th bit of $x$.

Select $x = 0^{256}$. Present $(m, x)$ to the MAC verification orcale and let $T$ be time taken for the orcale's response. Similarly, present $(m, x^1)$ to the MAC verification orcale and let $T^1$ be the time taken for the oracle's response. Now, if the first bit of $x$ is equal to the first bit of the correct tag $t$ of $m$ (and consequently the first bit of $x^1$ is different from the first bit of $t$), then one would expect that $T > T^1$ (since the orcale will exit the for loop sooner when presented with $(m, x^1)$ than with $(m, x)$). Thus, if $T^1 > T$, then replace $x$ with $x^1$. Note that the first bit of $x$ is now equal to the first bit of $t$

Next, present $(m, x)$ and $(m, x^2)$ to the MAC verification orcale, and let $T$ and $T^2$ be the time taken. If $T^2 > T$ then replace $x$ with $x^2$. Note that the first two bits of $x$ are now equal to the first two bits of $t$. 

Repeat this process to determine each of the 256 bits of $t$. The attack uses at most 512 oracle queries.

2. The attack can be defeated by ensuring that the for loop is never exited until all 256 iterations have been executed, and that the time taken during each iteratoin is independent of the bits of $t$. Here is one way to accomplish this.

> *INPUT* : A message $m$, a tag $t \in \{0, 1\}^{256}$, and a secret key $k \in \{0, 1\}^{256}$
> 
> *OUTPUT* : "Accept" or "Reject"

> Compute $t' = \text{MAC}_k(m)$ 
> 
> reject $\leftarrow 0$
> 
> dummy $\leftarrow 0$
> 
> For $i$ from 1 to 256 do :
> - If the $i$th bit of $t$ is different from the $i$th bit of $t;$ then :
>     - reject $\leftarrow 1$
>     - else : dummy $\leftarrow 1$
> - If reject $= 1$ then :
>     - Output "Reject"
>     - else : Output "Accept"

*Remark* : Such "timing attacks" are quite common in practice. In 2007, a timing attack of this kind was used to defeat part of the secure boot process of Microsoft's Xbox 360. During boot, the console checked the integrity of a bootloader by comparing a 16-byte HMAC value against a stored value, and refused to boot if they differed. The comparison used the "memcmp" fucntion, which compared the two values one byte at a time and stopped at the first mismatch. The timing difference between a correct and an incorrect byte was about 2200 microseconds, large enough to measure with simple hardware. By guessing each byte in turn and measuing the response time, an adversary could recover a valid HMAC value for a modified bootloader with at most $16 \times 256 = 4096$ guesses, rather than the $2 ^ {128}$ guesses needed by brute force. This allowed them to downgrade the console to an older kernel with a known vulnerability, which, combined with a separated software exploit, let them run unsigned code such as homebrew software and Linux. See [https://free60.org/Timing_Attack/](https://free60.org/Timing_Attack/)

In 2009, it was discovered that the HMAC verification algorithm in Google's free Keyczar crypto library had this flaw and was thus vulnerable to timing attacks; see [https://rdist.root.org/2009/
05/28/timing-attack-in-google-keyczar-library](https://rdist.root.org/2009/05/28/timing-attack-in-google-keyczar-library)

To prevent such timing attack, a software implementation of a cryptographyic algorithm that uses secret keying material should run in constant time. This can be achieved by adding dummy instructions, avoiding branching, etc.

# Algorithm analysis
Describe a *polynomial-time algorithm* that, on input an integer $n \ge 1$, determines whether $n$ is a 2026th power; that is, your algorithm should determine if there exists an integer $a \in \mathbb{N}$ such that $n = a^{2026}$. ($\mathbb{N}$ is the set of natural numbers.) Using big-O notation, give an upper bound on the number of bit operations your algorithm takes

## Solutions
Here is pseudocode description of a binary search for detecting 2026th powers. The input to the algorithm is an integer $n \ge 1$ :
$$
\begin{aligned}
&a \leftarrow 1,\quad b \leftarrow n,\quad interval \leftarrow b-a \\
&\textbf{while } (interval > 1) \textbf{ do} \\
&\qquad x \leftarrow \left\lfloor \frac{a+b}{2} \right\rfloor \\
&\qquad \textbf{if } (x^{2026} > n) \textbf{ then} \\
&\qquad\qquad b \leftarrow x \\
&\qquad \textbf{else} \\
&\qquad\qquad a \leftarrow x \\
&\qquad interval \leftarrow b-a \\
&\textbf{if } (n = a^{2026}) \textbf{ then} \\
&\qquad \textbf{return } (\text{``the 2026th root is } a\text{''}) \\
&\textbf{else} \\
&\qquad \textbf{return } (\text{``}n\text{ is not a 2026th power''})
\end{aligned}
$$

*Analysis* : Let $k = \lfloor\log_2{n}\rfloor + 1 \approx \log_2{n}$ be the bitlength of $n$. The algorithm uses a binary search on the interval $[1, n]$, maintaining $a ^ {2026} \le n < b^{2026}$ (when $n \ge 2$). In each iteration of the "while" loop, the length of the interval is decreased by half. Thus, the number of loop iterations necessary to reduce the interval to length 1 is at most $k$

In each loop iteration, $x$ is at most $n$, so computing $x ^ {2026}$ takes $O(k^2)$ bit operations (since 2026 is a constant). Thus, the number of bit operations required by the algorithm can be upper bounded by 
$$
O(k) (\text{initialization}) + k \cdot O(k + k^2 + k) (\text{loop iterations}) + O(k^2) (\text{final check})
$$
or $O(k^3)$. Hence the algorithm has a polynomial running time

# Computing GCDs without long division
One of the drawbacks of the Euclidean algorithm is that it requires long division which can be difficult to implement in software and hardware. The following algorithm for computing greatest common divisors only uses divisions by 2, an operation which can be easily implemented as a right-shift of the binary representation

>**Algorithm : GCDNoDivision**
> Input : Positive integers $a, b$
> Output : gcd($a, b$)
> 1. $e \leftarrow 1$
> 2. While $a$ and $b$ are both even do :
> $$
> a \leftarrow a/2, b \leftarrow b/2, e \leftarrow 2e
> $$
> 3. While $a \neq 0$ do 
> - While $a$ is even do : $a \leftarrow a/2$
> - While $b$ is even do : $b \leftarrow b/2$
> - If $a \ge b$ then 
> $$
> a \leftarrow a - b
> $$
> else 
> $$
> b \leftarrow b - a
> $$
> 4. $d \leftarrow e \cdot b$
> 5. RETURN($d$)

1. Compute hcd(1326, 1716) using GCDNoDivision. (Show the main steps of your work)
2. Prove that GCDNoDivision *terminates*
3. Prove that GCDNoDivision is *correct* (that is, $d = \gcd(a, b)$)

You may use the following results without proof : $\gcd(a, b) = gcd(a, b - a)$ for all integers $a, b$
4. Determine the running time of GCDNoDivision in bit operations. The running time should be expressed in terms of $k$, where $k$ is the bitlength of the larger of $a$ and $b$. (Justify your answer.)

*Hint* : Consider the binary representations of $a$ and $b$
5. Is GCDNoDivision a polynomial-time algorithm ? (Justify your answer.)

## Solutions
*Remark* : This gc dalgorithm was design by J. Stein in 1967 for the purpose of computing certain matrices that are needed in the study of atomic spectroscopy. The algorithm was descrived in his paper "Computational problems associated with Racah algebra", published in the *Journal of Computational Physics*

1. Let $a = 1326$ and $b = 1716$

After step (2), we have $a = 663, b = 858, e = 2$

The values of $(a, b)$ at the end of each iteration of step (3) are : 
$$
(234, 429), (117, 312), (78, 39), (0, 39)
$$
Thus $d = \gcd(1326, 1716) = 2 \cdot 39 = 78$

2. The while loop in step (2) is executed $t$ times, where $t$ is the largest integer such that $2 ^ t$ divides both $a$ and $b$. Thus, we only need to prove that the main loop in step (3) is not an infinite loop.

First note that if the operation $a \leftarrow a/2$ is executed, then the value of $a$ becomes smaller. Similarly if the operation $b \leftarrow b/2$ is executed, then the value of $b$ becomes smaller. Now, since the operation $b \leftarrow b - a$ is only executed if $b > a$, we always have $b > 0$. Hence, as a result of the substraction operation, exactly one of $(a, b)$ is replaced by a smaller non-negative number. Thus, during each iteration of step (3), at least one of $(a, b)$ is replaced by a smaller non-negative number; and certainly no number is replaced by a larger one. Hence $a + b$ strictly decreases in each iteration, so the main loop in step (3) can only be executed a finite number of times. Thus the algorithm always terminates

3. Let us denote the inputs to the algorithm by $a_0$ and $b_0$. Let $t$ be the largest integer such that $2 ^t $ divides both $a_0$ and $b_0$. Let $e = 2 ^ t$, and let $c = \gcd(a_0 / e, b_0 / e)$. Then $\gcd(a_0, b_0) = e \cdot c$. To prove that the algorithm is correct, we need to prove that the value of the variable $b$ at the end of step (3) is $c$.

Now at the beginning of step (3), at most one of $a, b$ is even. If $a$ is even, then the operation $a \leftarrow a/2$ does not change the value of $\gcd(a, b)$. Similarly, for the case $b$ is even. Just before the if statement, we havethat both $a$ and $b$ are odd. By the given fact, the operation $a \leftarrow a- b$. or $b \leftarrow b - a$ also does not change the value of  $\gcd(a, b)$. Thus, at the end of each iteration of the main loop in step (3), we have $\gcd(a, b) = c$ and exactly one of $a, b$ is even. It follows that at the end of step (3), we have $c = \gcd(a, b) = gcd(0, b) = b$

4. As observed in (2), the numbers $a, b$ never get larger. Thus each subtraction, division by 2, and multiplication by 2 operation takes $O(k)$bit operations. Now, before the if statement in step (3) is executed, noth $a, b$ are odd. Thus, after the subatraction operation in the if statement, exactly one of $a, b$ is even. Hence, at least one operation $a \leftarrow a/2, b \leftarrow b/2$ is executred during each iteration of the main loop in step (3), with the possible exception of the first iteration. Since each such operation decreases the bitlength of $a$ or $b$ by 1, it follows that the nmber of times the main loop in step (3) is executed is at most $2k + 1$. Moreover, the total number of halving operations in step (3) is at most $2k$, and step (2) is executed at most $k$ times. Since each subtraction, halving and doubling takes $O(k)$ bit operations. the running time of the algorithm is $O(k \cdot k) = O(k^2)$ bit operations

5. Since the running time is bounded by a polunomial in the input size (namely $k$), GCDNoDivision is a polynomial-time algorithm

# MACs
Suppose that EMAC is used with one key (so $k = s$). Show that this variant of EMAC is insecure

## Solutions
Here is an efficient attack on modified EMAC :
- Select a one-block message $m_1 in \{0, 1\}^n$
- Obtain the tag $t_1$ of $m_1$ from the MAC orcale : $t_1 = E_k(E_k(m_1))$
- Set $m_2 = (m_1, 0^n, m_1 \oplus t_1)$ and $t_2 = t_1$
- Output $(m_2, t_2$ as the forgery

*Correctness* : Note that $m_2 \neq m_1$. Also, the valid tag on $m_2$ is :
$$
\begin{aligned}
t_2
&= E_k(E_k(E_k(E_k(m_1) \oplus 0^n) \oplus m_1 \oplus t_1)) \\
&= E_k(E_k(E_k(E_k(m_1) \oplus m_1 \oplus t_1))) \\
&= E_k(E_k(t_1 \oplus m_1 \oplus t_1)) \\
&= E_k(E_k(m_1)) \\
&= t_1.
\end{aligned}
$$

*Remark* : There are many possible solutions to this problem

# Envelope encryption
Suppose that Alice shares a secret key $k_1 \in_R \{0, 1\}^{128}$ with Bob, and a secret $k_2 \in_R \{0, 1\}^{128}$ with Chris. Alice uses *envelope encryption* as follows to securely send a message $m \in \{0, 1\}^*$ to Bob and Chris:
- Select a session key $k \in_R \{0, 1\}^{128}$
- Compute $c_1 = \text{AES-GCM}_{k_1}(k)$ and $c_2 = \text{AES-GCM}_{k_2}(k)$
- Compute $c = \text{AES-GCM}_k(m)$
- Send $(c_1, c)$ to Bob and $(c_2, c)$ to Chris 

*Note* : $\text{AES-GCM}_k(m)$ denotes the AES-GCM encryption/authentication of $m$ using secret key $k$. The additional authentication data (AAD) is empty, so the result is $(IV, c, t)$

1. Briefly describe how Bob can recover $m$ and verify its authenticity
2. Show that htis use of envelope encryption is *not* a secure authenticated encryption scheme. State the assumption you make, if any.

# Solution
1. bob, who receives $(c_1, c)$, decrypts and authenticates $c_1$ using $k_1$, thus obtaining the session key $k$; Bob is convinecd that $k$ originated from Alice. He then decrypts and authenticates $c$ using $k$, thus obtaining $m$

2. Suppose that Bob receives $(c_1, c)$ from Alice. Suppose also that Bob obtains $(c_2, c)$ that Alice sent to Chris. Bob decrypts $c_1$ using $k_1$ to obtain $k$. He then selects a message $m'$, computes $c' = \text{AES-GCM}_k(m')$, and sends $(c_2, c')$ to Chris. Chris decrypts/authenticates $c_2$ to get the session key $k$, and then decrypts/authenticates $c'$ to get $m'$, wrongly concluding that Alice sent him $m'$

# Analysis of the Euclidean algorithm 
Recall that the Euclidean algorithm for computing $\gcd(a,b)$ is the following : Divibe $a$ by $b$; if the remainder is 0, then $\gcd(a, b)= b$. Otherwise, divide the previous divisor by the previous remainder, and continue until we get a 0 remainder. Then $\gcd(a, b)$ is the last nonzero remainder obtained.

This process can be represented by the following equations :
$$
\begin{aligned}
a &= q_1 b + r_1, && 0 < r_1 < b \\
b &= q_2 r_1 + r_2, && 0 < r_2 < r_1 \\
r_1 &= q_3 r_2 + r_3, && 0 < r_3 < r_2 \\
&\vdots \\
r_{t-3} &= q_{t-1} r_{t-2} + r_{t-1},
&& 0 < r_{t-1} < r_{t-2} \\
r_{t-2} &= q_t r_{t-1} + r_t,
&& 0 < r_t < r_{t-1} \\
r_{t-1} &= q_{t+1} r_t + 0.
\end{aligned}
$$
Then $\gcd(a, b) = r_1$

1. Prove that $r_{i+2} < \frac{1}{2}r_i$ for all $1 \le i \le t-2$
2. Hence prove that the Euclideaan algorithm is a polynomial-time algorithm

## Solutions
1. There are two solutions : 

> **Solution 1** : 

We have 
$$
\begin{aligned}
r_{i-2} &= q_i r_{i-1} + r_i,
&& 0 < r_i < r_{i-1}, \\
r_{i-1} &= q_{i+1} r_i + r_{i+1},
&& 0 < r_{i+1} < r_i, \\
r_i &= q_{i+2} r_{i+1} + r_{i+2},
&& 0 < r_{i+2} < r_{i+1}.
\end{aligned}
$$
If $r_{i+1} < \frac{1}{2} r_i$, then $r_{i+2} < \frac{1}{2} r_i$, and we are done 

If $r_{i+1} \ge \frac{1}{2} r_i$, then $q_{i+2} = 1$, so $r_i = r_{i + 1} + r_{i + 2}$.

Hence $r_{i+2} < \frac{1}{2} r_i$

> **Solution 2** : 

We have $r_i = q_{i+2} r_{i+1} + r_{i+2}$, where $0 < r_{i+2} < r_{i+1} < r_i$. Observe that $q_{i+2} \neq 0$, since otherwise $r_i = r_{i+2}$. Hence $q_{i+2} \ge 1$. We have
$$
r_{i+2} = r_i - q_{i+2}r_{i+1} \le r_i - r_{i+1} < r_i - r_i+2
$$
so $r_{i+2} < \frac{1}{2} r_i$

2. Let $k$ be the bitlength of the larger of $a$ and $b$ are each at most $k$ bits in length. Since $r_{i+2} < \frac{1}{2} r_i$, the bitlength of $r_{i+_2}$ is atleast one less than the bitlength of $r_i$. Hence, since the bitlength of $r_1$ is at most $k$, there can be at most $2k$ division steps in the Euclidean algorithm before a zero remainder is encountered. Each division involves integers $\le a$,m so takes $O(k^2)$ bit operations. Hence the total running time is $O(k^3)$ bit operations

*Remark* : Suppose that $a$ and $b$ are positive integers with $a \ge b$. You can verify that the number of bit operations in the ordinary long division algorithm for dividing $a$ by $b$, i.e., writing $a = qb + r$ with $0 \le r < b$, is $O((\log{q})(\log{b}))$ bit operations. Using this more precise upper bound on the running time of long division, you can verify that a better upper bound on the running time of the Euclidean alogirhtm is $O(k^2)$ bit operations