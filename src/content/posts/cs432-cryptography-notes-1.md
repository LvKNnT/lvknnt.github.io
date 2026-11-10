---
title: "[CS432] Cryptography - Chapter 2"
date: 2026-10-17
description: "Symmetric key encryption"
series: "Cryptography Course"
seriesOrder: 1
---

# SYMMETRIC-KEY ENCRYPTION

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter-2.pdf) so this is just my own notes

- 2.1 Fundamental concepts
- 2.2 Stream ciphers
- 2.3 Block ciphers : DES
- 2.4 Block ciphers : AES
- 2.5 Modes of operation

## 2.1 Fundamental Concepts
**Definition** : A `symmetric-key encryption scheme` (SKES) consists of : 
- M : the plaintext space
- C : the ciphertext space 
- K : the key space 
- a family of encryption functions : $E_k : M \rightarrow C, \forall k \in K$
- a family of decryption functions : $D_k : C \rightarrow M, \forall k \in K$ such that $D_k(E_k(m)) = m$ for all $m \in M, k \in K$

### Adversary's interaction
- Passive attack : 
    - `Ciphertext-only attack` : The adversary knows some ciphertext 
    - `Known-plaintext attack` : The adversary also knows some plaintext and the corresponding ciphertext.
- Active attack :
    - `Chosen-plaintext attack` : The adversary can also *choose* some plaintext and obtains the corresponding ciphertext.
    - `Chosen-ciphertext attack` : Teh adversary can also *choose* some ciphertext and obtains the corresponding plaintext
- Other attacks (sadly not include in this course) :
    - `Side-channel attack` : monitor the encryption and decryption equipment (timing attacks, power analysis attacks, electromagnetic rediation analysis, etc.)
    - `Clandestine attacks` : bribery, blackmail, etc.

### Definition of a secure SKES
**Definition 1** : A symmetric-key encryption scheme is said to be `secure` (`SEM-CPA secure`) if it is semantically secure against chosen-plaintext attack by a computationally bounded adversary

**Definition 2** : A symmetric encryption shceme is said to be `secure` (`IND-CPA secure`) if it is indistinguishable against chosen-plaintext attack by a computationally bounded adversary

### Desirable properties of a SKES
- Efficient algorithms should be known for computing $E_k$ and $D_k$ (i.e., for encryption and decryption)
- The secret key $k$ should be small, but large enough to render exhaustive key search infeasible.
- The scheme should be secure.
- The scheme should be secure *even against the designer of the system*

### Work factor 
- 40bit is very easy
- 56 bit is easy
- 64bit is feasible
- 80 bit is barely feasible
- 128 bit is infeasible

### Security level 
**Definition** : A cryptographic scheme is said to have security level of l bit if the fastest known attack on the scheme takes approximately l bit operations

## 2.2 Stream ciphers
**Basic idea** : Instead of using a random key in the one-time pad, use a *pseudorandom* key

**Definition** : A `pseudorandom bit generator` (PRGB) is a *deterministic* algorithm that takes as input a (random) `seed`, and outputs a longer *pseudorandom* sequence called the `keystream`

`Stream cipher` : uses a PRGB for encryption (and decryption). The seed is the secret key shared by Alice and Bob.
- No more perfect secrecy - security depends on the quality of the PRGB
- **Note** : As with the one-time pad, the keystream in a stream cipher should never be reused!

### Security requirements for the PRGB
- `Indistinguishability requirement` : the keystream should be "indistinguishable" from a randomm sequence.
- `Unpredictability requirement` : given portions of the keystream, it should be computationally infeasible to learn any information about the remainder of the keystream
    - If an adversary knows a portion $c_1$ of ciphertext and the corresponding plaintext $m_1$, then she can easili find the corresponding portion $k_1 = c_1 \oplus m_1$ of the keystream
- `Note` : Don't use UNIX random number generators `rand` and `srand` for cryptographic purposes!

### ChaCha20 stream cipher 
ChaCha20 intial state :
- 256 bit key k : 8 
- 128 bit constant f : 4
- 96 bit nonce nonce : 3
- 32 bit counter c

### ChaCha20 Quarter Round Function
```
Input : Four 32-bit words a, b, c, d
a : a + b ; d : d x a ; d : d <<< 16
c : c + d ; b : b x c ; b : b <<< 12
a : a + b ; d : d x a ; d : d <<< 8
c : c + d ; b : b x c ; b : b <<< 7
```

Thus, The quarter round is a 128 bit permutation

### ChaCha20 Keystream Generator
For a cycle of ChaCha20 : need the same nonce and only increase counter, only update the key
```
- Create S, copy S'
- Update S : QR-ing these pair 
	(1, 5, 9, 13), (2, 6, 10, 14), (3, 7, 11, 15), (4, 8, 12, 16) : all columns
	(1, 6, 11, 16), (2, 7, 12, 13), (3, 8, 9, 14), (4, 5, 10, 15) : all diagonal-is ?
- S : S + S' (64 bytes)
- c : c + 1
```

`Encryption` : The keystream bytes are xored with the plaintext bytes to produce ciphertext bytes. *The nounce is appended to the ciphertext*

## 2.3 Block ciphers : DES
- A `block cipher` is a summetric-key encryption scheme that breaks up the plaintext into blocks of a fixed length (e.g. 128 bits), and encrypts the blocks one at a time
- In constrast, a `stream cipher` encrypts the plaintext one character (usually a bit) at a time.

### Some desirable properties of block ciphers 
**Security** : 
- `Diffusion` : each ciphertext bit should depend on all plaintext bits
- `Confusion` : the relationship between key and ciphertext bits should complicated
- `Key length` : should be small, but large enough to preclude exhaustive key search

**Efficiency** :
- `Simplicity` : easier to omplement and analyze
- `Speed` : high encryption and decryption rates
- `Platform` : suitable for hardware and software 

### DES problem
**#1** : 
- `Small key size` : Exhaustive search on the key space can easily be *parallelized*
- `Small block size` : If the plaintextblocks are distributed "uniformly at random" then the expected number of ciphertext blocks observed before a collision occurs is $\approx 2^{32}$ (by the birthday paradox)
    - `Birthday paradox` : Suppose that an urn constains $n$ numbered balls. Suppose that balls are drawn form the urn, one at a time, with replacement. The expected number of draws before a ball is selected for the second time (called a `collision`) is approximately $\sqrt{\pi n /  2} \approx \sqrt{n}$
    - Hence the ciphertext reveals *some* information about the plaintext.

### Multiple encryption
- `Multiple encryption` : Re-encrypt the ciphertext one or more times using independent keys. Hope that this increases the effective key length
- `Note` : Multiple encryption does not necessarily result in increased security. 

### Meet-in-the-middle attacck on Double-DES
> Number of plaintext/ciphertext pairs needed

**Question** : How many plaintext/ciphertext pairs are needed for unique key determination ? 
**Answer** : Select $t$ so that $FK \approx 0$ (where $FK$ is the expected number of `false key`)

- The expect number of `false key` $k \in K$ (not including $k'$) for which $E_k(m_i) = c_i$ for all $1 \le i \le t$ is $FK = \frac{2^l - 1}{2 ^ {Lt}}$

> Analysis of the meet-in-the-middle attack

- `Time` : The number of DES operations is $\approx 2^{56}$ (We are not counting the time to do the sorting and searching)
- `Space` requirements : $2^{56} (64 + 56)$ bits $\approx$ 1,080,864 Tbytes
- `Conclusions` : The security level of Double-DES is 57 bits, so Double-DES is not much more secure than DES

### Triple-DES
- The security level of Triple-DES is 112 bits
- There is no *proof* that Triple-DES is more secure than DES
- `Note` : the block length is unchange
- Triple-DES is still deployed in practice, especially by some financial instituition where its use can be expected to continue until 2030

## 2.4 Block ciphers : AES

### The Advanced Encryption Standard (AES) 
- `Key length` : 128, 192 and 256 bits
- `Block length` : 128 bits
- `2026` : No attacks have been found on AES that are (significantly) faster than exhaustive key search
- AES is an example of a *substituition-permutation network*

### Substituition-Permutation networks
A `substituition-permutation network` (SPN) is an iterated block cipher where a `round` consists of a substituition operation followed by a permutation operation

Components of an SPN cipher :
- *n* : the block length (in bits)
- *l* : the key length (in bits)
- *h* : the number of round
- A fixed invertible function $S : \{0, 1\}^b \rightarrow \{0, 1\} ^ b$ called a `substituition`, where $b$ is a divisor of $n$
- A fixed `permutation` P on $\{1,2,\dots,n\}$
- A `key scheduling algorithm` that determines `subkeys` $k_1, k_2, \dots, k_h, k_{h+1}$ from a key $k$

**Note** : $n,l,h,S,p$ and the key scheduling algorithm are public. The only secrect in an SPN is the key $k$ that is selected.

### AES
- AES is an SPN, where the permutation operation consists of two invertible linear transformations
- All opertaions are `byte oriented` : the S-box maps 8 bits to 8 bits. This facilitates fast implementations on software platforms
- The block length of AES is $n = 128$
- Each subkey is 128 bits
- AES accepts three key lengths. The number of rounds $h$ depends on the key length.

### AES round operations 
- Each round updates a variable called `State` which consists of a $4 \times 4$ array of bytes (note $4 \times 4 \times 8 = 128$, the block length)
- `State` is initialized with the plaintext
- Each AES round uses four *invertible* operations :
    - `AddRoundKey` (key mixing) : Bitwise-XOR each byte of `State` with the corresponding byte of the subkey
    - `SubBytes` (S-box) : Take each byte in `State` and replace with the output of the S-box
    - `ShiftRows` (permutation) : Permutate the bytes of `State` by applying a cyclic shift to each row
    - `MixColumns` (linear transformation) : multiply with a constant polynomial $c(x) = 02 + 01x + 01x^2 + 03x^3$ and reduce modulo $x^4 - 1$. 
    - **Bonus** `InvMixColumns` : this is for decryption only. It is the same as MixColumns but we using $d(x)  = 0e + 09x + 0dx^2 + 0bx^3$ for multiplication instead
- After *h* rounds are completed, a final subkey is XORed with `State`, the result being the ciphertext.

### AES summary
- AES is a widely-used, efficient, and secure symmetric-key block cipher
- The fastest attac known on AES-128 is **exhaustive key search**, which takes $2^{127}$ steps on average (and $2^{128}$ steps in the worst case)

## 2.5 Modes of operation
- Thee are many modes of operation, including :
    - Encryption only : `ECB`, `CBC`, `CTR`
    - Authenticated encryption : `GCM`, `CCM`

### Electronic Codebook Mode (ECB)
- `Electronic Codebook Mode (ECB)` : encrypt the blocks independently, one at a time. 
- **Drawback** : Identical plaintext blocks result in identical ciphertext blocks (under same *k*), so ECB mode is *insecure*

### Cipher Block Chaining (CBC) mode
- `Encryption` : Select $c_0 \in_R \{0, 1\}^L$ ($c_0$ is a random non-secret IV), and then compute $c_i = E_k (m_i \oplus c_{i-1})$ for i from 1 to t. The cipher text then is $(c_0, \dots, c_t)$
- `Decryption` : $m_i = E_k^{-1}(c_i) \oplus c_{i-1}$, for i from 1 to t.

- Identical plaintexts with different IVs results in different ciphertexts (with high probability)
- `Fact` : CBC encryption has been proven to be semantically secure against chosen-plaintext attacks (assuming that the block cipher $E$ is secure)
