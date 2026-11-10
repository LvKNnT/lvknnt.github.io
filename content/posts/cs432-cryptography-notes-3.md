---
title: [CS432] Cryptography - Chapter 4
date: 2026-10-31
description: Message authentication codes
series: Cryptography Course
seriesOrder: 3
---


# MESSAGE AUTHENTICATION CODES

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter4.pdf) so this is just my own notes

- 4.1 : Fundamental concepts
- 4.2 : CBC-MAC and HMAC

## 4.1 Fundamental concepts
- **Definition** : A `message authentication code` (MAC) scheme is a family of functions $MAC_k : \{0, 1\}^* \rightarrow \{0,1\}^n$ parameterized by an l-bnit key *k*, where each function $MAC_k$ cacn be efficiently computed

- $t = MAC_k(x)$ is called the `MAC` or `tag` of *x* with key *k*
- MAC schemes are used for providing (symmetric-key) `data integrity` and `data origin authentication`

### Security definition 
- **Definition** : A MAC scheme is `secure` if given some tags $MAC_k(x_i)$ for messages $x_i'$ of *one's own choosing*, it is computationally infeasible to compute (with non-negligible success probability) a message-tag pair $(x, MAC_k(x))$ for a new message *x*. 
- More concisely, a MAC scheme is `secure` if it is *existentially unforgeable against chosen-message attack*

### Ideal MAC scheme
- An `ideal` MAC scheme has the following property : For each key $k \in \{0, 1\} ^ l$, the function $MAC_k : \{0,1\} ^ * \rightarrow \{0,1\}^n$ is a random function
- Ideal MAC schemes are useless in practice

### Generic attacks on MAC schemes
- `Guessing the tag` : Obviously is impracticaln
- `Exhaustive search on the key space` : Also impractical when $l \ge 128$

### GSM
- Glocal standards for mobile communication :
    - `2G`, `2.5G` : `GSM` (Global system for Mobile Communication)
    - `3G` : UMTS (Universal Mobile Telecommunications System)
    - `4G` : LTE (Long Term Evolution)
    - `5G` : NR (New Radio)
- GSM security is notable since it uses only symmetric-key primitives

### GSM security objectives
- `Entity authentication` : The cell phone service provider needs the assurance that entities accessing its service are legitimate subscribers
- `Confidentiality` : The data exchanged between a cell phone user and their cell phone service provider should be confidential

### GSM description 
**Cryptographic ingredients** :
- `Enc` : A symmetric-key encryption scheme
- `MAC` : A symmetric-key MAC scheme
- `KDF` : A key derivation function

**Setup**
- A SIM card manufacturer randomly selects a secrets key *k*, and installs it in a SIM card. A copy of *k* is given to the cell phone servicec provider 
- When a user subscribers to a cell phone service, she gets the SIM card which she installs in her phone.
- `Note` : a different key *k* is chosen for each user

### GSM security 
- One drawback with using only symmetric-key cryptography is that the SIM card manufacturer and the cell phone sevice providers have to securely maintain a large database of SIM keys *k*

## 4.2 CBC-MAC and HMAC
`CBC-MAC` : 
- Let $E$ be an n-bit block cipher with key space $\{0, 1\}^l$
- **Asssumption** : Plaintext messages all have lengths that are multiples of *n*.

### Security of CBC-MAC
**Informal statement of a Theorem** : Suppose that $E$ is an *ideal* block cipher. Then CBC-MAC *with fixed-length messages* is a `secure` MAC scheme

- CBC-MAC is not secure if variable-length messages are allowed

### Encrypted CBC-MAC (EMAC)
**Informal statement of a Theorem** : Suppose that $E$ is an *ideal* block cipher. Then EMAC is a `secure` MAC scheme (for messages of any length).

### MAC based on hash functions
- This is **insecure**. There is a `length extension attack` 
- Also insecure if messages can be of any bitlenght and a length bolock is appended to $K||x$

### HMAC 
- **Definition** : $HMAC_k(x) = H(K \oplus opad, H(K \oplus ipad, x))$
- Security analysis is rigorous : Suppose that the compression fucntion *f* used in *H* is a secure MAC with fixed-length messages and a secret IV as the key. Then HMAC is a secure MAC scheme.

### Key derivation functions 
HMAC is commonly used as a `key derivation function` (KDF) :
- Suppose that Alice has a secret key *k*, and wishes to derive several session keys $sk_i$, to encrypt data in different communication sessions
- **Rationale** : Without knowledge of *k*, an adversary is unable to learn anything about any particular session key $sk_i$, even though she might have learnt some other session key