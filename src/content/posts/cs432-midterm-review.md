---
title: "[CS432] Cryptography - Midterm Review"
date: 2026-11-18
description: "Midterm review extra notes"
---

# First Notes
You should checkout the test information [here](https://cryptography101.ca/wp-content/uploads/Test_information.pdf) for details. This is only the summary what I need to review :

- Slides : Chapter 1-6
- Labs : Lab01 to Lab03, including the extra exercise
- Miscellaneous-notes

# Miscellaneous notes

## 28 - 10 - 2026
> CRYPTOGRAPHY = ALGORITHMS

As you will see in lectures, cryptography is all about algorithms, of whic hthere are three kinds
1. Attacks
2. Implemnetation
3. Security Reduction

### ATTACKS
An attack on a cryptographic scheme is an algorithm executed by an adversary to achieve some goal. The adversary's goal is specified by the secuirty dedfinition for the cryptographic scheme (e.g., learn a secret key, or learn something about the plaintext from a ciphertext, or find a collision). The security definition also specifies the adversary's capabilities (e.g., the ability to mount a chosen-plaintext attack on an encryption scheme, or the ability to obatin message-tag pairs for messages of her choosing when attacking a MAC scheme).

The main condition for an attack to be deemed successful is that its running time be feasible. We have a very concrete notion of "feasibility" : $2 ^ 64$ operations is feasible and $2 ^ {128}$ operations is infeasible (see slide 2.21).

An attack does not need to be successful 100% of the time in order to be deemed successful. If you can efficiently recover plaintext from ciphertext just 0.1% of the time, then the encryption scheme will be considered totallu insecure in practice. In particular, edge cases are generally not important. 

Also, when analyzing the running time of an attack, the analysis does not need to be rigorous. You can make reasonable assumptions and do a heuristic analysis. This is okay because in practice a heuristic run time analysis can be confirmed with experimentation.

Of course, it is always better if an attack is successful 100% of the time, has no edge cases, and has a rigorous analysis. But those are secondary concerns

### IMPLEMENTATIONS
Unlike attacks, implementations of cryptographic schemes and protocols must be very fast. By "fast" here, I don't mean "feasible" but fast in terms of fractions of a second or number of clock cycles

Furthermore, unlike attacks, implementations must always be correct and free of bugs. An implementaion should bot have edge cases that might fail (even with very small probability) since a malicious adversary will seek out and try to exploit thhose edge cases.

So, we see that cryptographic implementations require different kinds of algorithms and algorithmic thinking than cryptographic attacks

### SECURITY REDUCTIONS
A security reduction is a conditional security proof - a proof for statements of the form "If Assumption A holds, then B is secure". We saw several examples of security reductions in Chapter 3 on hash functions.

For example, Merkle;s Theorem (slides 3.31) states that if the compression function $f$ is collision resistant, then the iterated hash function $H$ is collision resistant. Here "$f$ us collision resistant" is an assumption, and "$H$ is collision resistant" is the security claim

To prove such statements, we prove the contrapositive statement. So, we prove that if B is not secure, then Assumption A is false. This is accomplished by designing an algorithm for violating Assumption A (e.g. efficeint finding a collision for f), using a hypothetical algorithm (called an *oracle*) that efficiently breaks B (e.g. efficiently finds collisions for $H$).

Such reduction algorithms are common in theoretical computer science, for example in the theory of NP-completeness (which you will see in your first algorithms course).

## 31 - 10 - 2026
> ATTACK CRYPTOGRAPHIC SCHEMES

When divising an attack on a cryptographic scheme, you should begin by identifying exactly what is given to the adversary, and what the adversary is required to find. These items can be deduced from the security definition for the cryptographic scheme
- For example, if you are asked to break a symmetric-key encryption scheme, then you have :
    - *Given* : An encryption oracle, and a challenge ciphertext $c$
    - *Find* : Some information about the plaintext $m$ corresponding to $c$ (other than its length)
- Another example : if you are asked to show that a hash function $H : \{0, 1\}^* \rightarrow \{0, 1\}^n$ is not preimage resistant, then you have :
    - *Given* : $y \in_R \{0, 1\}^n$
    - *Find* : An $x \in \{0, 1\}^*$ such that $H(x) = y$
- Another example : if you are asked to break a MAC scheme, then you have
    - *Given* : A MACing oracle
    - *Find* : A valid MAC-tag pair $(m, t)$, where $m$ was not queried to the MACing oracle

Sometimes, a question might place further restriction further restrictions on what is given to the adversary or what the adversary is required to find. For example, the adversary might required to find the secret key in a symmetric-key encryption scheme without access to an encryption oracle. 

In all cases, you can assume that you know everything about the cryptographic scheme except for the secret keying material. For example, if a cryptographic scheme uses a hash function $H$ or a symmetric-key encryption scheme $E$, you can assume that you have a complete description of $H$ and $E$. This is the "avoid security by obscurity" principle.

## 07 - 11 - 2026
Here are some terms and concepts whose definitions you are expected to know :
- Confidentiality (slide 1.5)
- Data integrity (slide 1.5)
- Data origin authentication (slide 1.5)
- Secure symmetric-key encryption scheme (slides 2.16, 2.17)
- Security level of a cryptographic scheme (slide 2.22)
- Preimage-resistant hash function (slide 3.10)
- Second-preimage resistant hash function (slide 3.11)
- Collision-resistant hash function (slide 3.12)
- Secure MAC scheme (slide 4.6)
- Secure authenticated encryption scheme (slide 5.7)
- Input size (slide 6.33)
- Running time of an algorithm (slide 6.34)
- Polynomial-time algorithm (slide 6.34)
- Exponential running time of an algorithm (slide 7.20)
- Subexponential running time of an algorithm slide 7.20)
- Secure public-key encryption scheme (slide 7.35)
- Security of a signature scheme (slide 7.45)
- Elliptic curve (slide 8.8)
- Point multiplication (slide 8.18)

### Confidentiality
Keep data secret form all but those authorized to see it

### Data integrity & Data origin authentication
`Data authentication` : 
- `Data integrity` : Prevent unauthorized modification of data
- `Data origin authentication` : Gain assurance of the source of data

### Secure symmetric-key encryption scheme
**Definition 1** : A symmetric-key encryption scheme is said to be `secure` (`SEM-CPA secure`) if it is semantically secure against chosen-plaintext attack by a computationally bounded adversary

**Definition 2** : A symmetric encryption shceme is said to be `secure` (`IND-CPA secure`) if it is indistinguishable against chosen-plaintext attack by a computationally bounded adversary

### Security level of a cryptographic scheme
**Definition** : A cryptographic scheme is said to have a `security level` of $\ell$ bit if the fastest known attack on the scheme takes approximately $ 2 ^ \ell$ operations

### Preimage-resistant hash function
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is `preimage resistant` if, given a hash value $y \in_R \{0, 1\} ^ n$, it is computationally infeasible to find (with non-negligible success probability) $any \ x \in \{0 , 1\} ^ x$ with $H(x) = y$. ($x$ is called a `preimage` of $y$)

### Second-preimage resistant hash function
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is a `2nd preimage resistant` if, given $x \in_R \{0, 1\} ^ *$, it is computationally infeasible to find (with non-negligible success probability) $any \ x' \in \{0, 1\} ^ x$ with $x' \neq x$ and $H(x') = H(x)$

### Collision-resistant hash function
**Definition** : A hash function $H : \{0, 1\} ^ * \rightarrow \{0, 1\} ^ n$ is a `collision resistance` if it is computationally infeasible to find (with non-negligible success probability) $x, x' \in \{0, 1\} ^ *$ with $x' \neq x$ and $H(x') = H(x)$. Such a pair $(x, x')$ is called a `collision` for $H$.

### Secure MAC scheme
**Definition** : A MAC scheme is `secure` if given some tags $MAC_k(x_i)$ for messages $x_i'$ of *one's own choosing*, it is computationally infeasible to compute (with non-negligible success probability) a message-tag pair $(x, MAC_k(x))$ for a new message *x*. 

More concisely, a MAC scheme is `secure` if it is *existentially unforgeable against chosen-message attack*

### Secure authenticated encryption scheme
**Definition** : An authenticated encryption scheme $AE$ is `AE-secure` if : 
- $AE$ is `semantically secure against chosen plaintext attack`; 
- $AE$ is `ciphertext integrity` : an adversary who is able to obtain ciphertext-tag pairs $(c_1, t_1), \dots, (c_\ell, t_\ell)$ for plaintext messages of her choosing, is unable to produce a valid ciphertext-tag pair $(c, t)$ where $c \notin \{c_1, \dots, c_\ell\}$

### Input size
**Definition** : The `input size` is the number of bits required to write down the input using a reasonable encoding :
- e.g., the size of a positive integer $n$ is $\lfloor \log_2{n} \rfloor + 1$ bits

*Note* : $k = \log_2{n} \iff n = 2^k$

### Running time of an algorithm
**Definition** : The `running time` of an algorithm is an upper bound, as a function of the input size, of the worst case number of basic operations the algorithm executes over all inputs of a fixed size

### Polynomial-time algorithm
**Definition** : An algorithm is a `polynomial-time` (*efficient*) alforithm if its (expected) running time is $O(k^c)$, where $k$ is the *input size* and $c$ is a fixed positive number

### Exponential running time of an algorithm
`Exponential-time algorithm` : One whose worst-case running time is not of the form $O(n^c)$ for any constant $c$

In this course, `fully exponential-time` functions are of the form $2 ^ {cn}$, where $c$ is a constant, example : $O(2 ^ {n/2})$

### Subexponential running time of an algorithm
`Subexponential-time algorithm` : One whose worst-case running time function is of the form $2 ^ {o(n)}$, and not of the form $O(n^c)$ for any constant $c$; example : $O(2 ^  {\sqrt{n}})$

### Secure public-key encryption scheme
**Definition** : A public-key encryption scheme is `secure` if it is semantically secure against chosen-ciphertext attack by a computationally bounded adversary

To `break` a public-key encryption scheme, the adversary $E$ has to accomplish the following : 
- $E$ is given the `public key` and a `challenge ciphertext` $c$
- $E$ has a `decryption oracle`, to which she can present any ciphertexts for decryption *except for $c$ itself*
- After a feasible amount of computation, $E$ shold learn *something* about the plaintext $m$ that corresponds to $c$ (other than its length)

### Security of a signature scheme
**Definition** : A signature scheme is `secure` if it is existentially unforgeable by a computationally bounded adversary who launches a chosen-messsage attack

Note : The adversary has access to a signing oracle. Her goal is to compute a single valid message0signature pair for any message (of the adverary's choosing) that was not previously given to the signing oracle

**Question** : Is the basic RSA signature scheme secure ?

**Answer** : 
- `No` : $H$ is SHA-256 (details omitted)
- `Yes` : $H$ is "full domain"

### Elliptic curve
Let $F = \mathbb{R}$ or $F = \mathbb{Z}_p$ (whre $p \ge 5$ is prime) 

`Definition` : An *elliptic curve E over F* is defined by a Weierstrass equation 
$$
E/F : Y^2 = X^3 + aX + b
$$
where $a,b \in F$ with $4a^3 + 27b^2 \neq 0$

`Definition` : The *set of F-rational point* on $E$ is $E(F) = \{(x, y) \in F \times F : y^2 = x^3 + ax + b\} \cup \{\infty\}$, where $\infty$ is a special point called the `point at infinity`

### Point multiplication
Let $E : Y^2 = X^3 + aX + b$ be an elliptic curve defined over $F = \mathbb{Z}_p$

Let $n = \#E(\mathbb{Z}_p)$, and suppose that `n is prime`. 
    
Recall that $n \approx p$ by Hasse's Theorem

`Definition` : Let $P \in E(\mathbb{Z}_p)$ and let $k \in \mathbb{N}$
- Then $kP = P + P + \dots + P.$ ($k$ times)
- Also, $0P = \infty$, and $(-k)P = - (kP)$