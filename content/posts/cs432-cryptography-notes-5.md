---
title: [CS432] Cryptography - Chapter 6
date: 2026-10-31
description: Public-key cryptography
series: Cryptography Course
seriesOrder: 5
---

# PUBLIC-KEY CRYPTOGRAPHY

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter6.pdf) so this is just my own notes

- 6.1 : Fundamental concepts
- 6.2 : Elementary number theory
- 6.3 : Algorithmic number theory

## 6.1 Fundamental concepts
**Symmetric-key cryptography** : Communicating parties a priori share some `secret` keying information

### Key establish problem
**Method 1** : `Point-to-point key distribution` (Alice selects the key and sends it to Bob over a secured channel)
- A trusted courier
- A face-to-face meeting
- A SIM card that contains an authentication key

*This is generally not practical for large-scale applications*

**Method 2** : `Use a Trusted Third Party` (TTP) $T$
- Each user $A$ shares a secret key $k_{AT}$ with $T$ for a symmetric-key encryption scheem $E$. To establish this key, $A$ must visit $T$ once.
    - $T$ serves as a `key distribution centre` (KDS)
- $A$ sends $T$ a requests for a key to share with $B$
- $T$ selects a session key $k$, and encrypts it for $A$ using $k_{AT}$
- $T$ encrypts $k$ for $B$ using $k_{BT}$

`Drawbacks of using a KDC` 
- The TTP must be *unconditionally trusted*
- The TTP is an attractive target
- The TTP must be on-line, and is therefore a potential bottleneck and critical reliability point

### Key management problem
- In a network of $n$ users, each user has to share a different secret key with every other user
- Thus each user has to store and manage $n-1$ different secret keys
- The total number of secret keys is $\binom{n}{2} \approx \frac{n^2}{2}$

### Non-repudiation is immpractical
- `Non-repudiation` : Preventing an entity from denying previous actions or commitments
    - Denying being the source of a message
- `Note` : Strictly speaking, symmetric-key techniques cannot be used to achieve non-repudiation

### Public-key cryptography
`Public-key cryptography` : Communicating parties a priori share some `authenticated` (but non-secret) information

### Key pair generation for public-key cryptography
Each entity $A$ does the following :
- Generate a key pair $(P_A, S_A)$
- $A$'s `public key` is $P_A$ and her `secret key` is $S_A$

- **Security requirement** : It should be infeasible for an adversary to recover $S_A$ from $P_A$
- **Example** : $S_A = (p, q)$ where $p, q$ are randomly-selected prime numbers, and $P_A = p \cdot q$

### Digital signatures
- Suppose that Alice generates a signed message $(m, s)$
- Then *anyone* who has an authentic copy of Alice's public key $P_A$ can verify the authenticity of the signed message
- `Note` : this authentication feature cannot be achieved with a symmetric key MAC scheme

Digital signatures shcemes are widely deployed to `sign software upgrades` which are then broadcast to computers around the world

### Public-key vs symmetric-key
`Advantages of public-key cryptography` :
- No requirement for a secured channel
- Each user has only one key pair, which simplifies key management
- A signed message can be verified by anyone
- Facilitates the provision of non-repudiation services (with digital signatures)

`Disadvantages of public-key cryptography` :
- Public-key schemes are slower than their symmetric-key counterparts

### Hybrid schemes
Use public-key to encrypt the message and symmetric-key to sign the message

## 6.2 Elementary number theory
I think you have learnt number theory crash course before decided to register this course

## 6.3 ALgorithmic number theory
I think you have learnt CS crash course before decided to register this course