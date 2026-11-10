---
title: [CS432] Cryptography - Chapter 5
date: 2026-10-31
description: Authentication encryption
series: Cryptography Course
seriesOrder: 4
---

# AUTHENTICATION ENCRYPTION

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter5.pdf) so this is just my own notes

- 5.1 : Fundamental concepts
- 5.2 : AES-GCM
- 5.3 : AWS Key Management Service (KMS)

## 5.1 Fundamental concepts
- A symmetric-key encryption scheme $E$ provides `confidentiality` : 
- A MAC scheme provides `data authentication`  (data origin authentication and data integrity)
- **Question** : What if confidentiality and authentication are `both` required? 

### Encrypt-and-MAC
This generic method is `not secure` : the tag $MAC_{k_2}(m)$ might leak some information about *m*.

### Encrypt-then-MAC
This generic method has been proven to be `secure`, provided that the encryption scheme $E$ and the MAC scheme employed are secure.

### Authenticated encryption security
**Definition** : An authenticated encryption scheme AE is `AE-secure` if : 
- AE is `semantically secure against chosen plaintext attack`; 
- AE is `ciphertext integrity` : ad adversary who is able to obtain ciphertext-tag pairs for plaintext messages of her choosing, is unable to produce a valid ciphertext-tag pair 

- **Note** : AE-security implies semantic security against *chosen-ciphertext* attacks

### Special-purpose AE schemes
- Many special-purpose authenticated encryption schemes have been developed, the most popular of which is using a symmetric-key encryption scheme such as AES in `Galois/Counter Mode (GCM)`
- Some of these authenticated encryption schemes also allow for the authentication (but not for encryption) of "header" data

## 5.2 AES-GCM
- `AES-GCM` : an authenticated encryoption scheme using the `CTR` mode of encryption and `GMAC`, a custom-designed MAC scheme

### CTR : CounTeR mode of encryption
- CTR mode of encryption can be viewed as a stream cipher
- As was the case with CBC encryption, identical plaintexts with deifferent IVs result in different ciphertexts
- It is critical that `IV should not be repeated`, but this can be difficult to achieve in practice
- Unlike CBC encryption, CTR encryption is `parallelizable` 
- Note that $AES^{-1}$ is not used
- The secret key can have bitlength 128, 192, or 256

### Security argument
Consider the `simplified tag` : $t' = f_A(H)$ :
- An adversary can guess the tag $t'$ of a message A with success probability $\frac{1}{2^{128}}$
- She can also guees the tag $t'$ by making a guess $H'$ for $H$ and computing $f_A(H')$. Her success probability is at most $\frac{v+1}{2^{128}}$, where $v$ is the block length of A.
- However, if the adversary sees a single valid message-tag pair $(A, t')$ she can solve the polynomial equation $f_A(H) = t'$ for $H$

To circumvent the aforementioned attack, a second secret $AES_k(J_0)$ is used to hide $t' : t = AES_k(J_0) \oplus f_A(H)$. The secret $AES_k(J_0)$ serves as a `one-time pad` for $t'$.

### Authenticated encryption : AES-GCM
`Input` : 
- `AAD (additional Authenticated Data)`, also called `encryption context` : Data to be authenticated (but not encrypted) : $A = (A_1, \dots, A_v)$
- Data to be encrypted and authenticated : $M = (M_1, \dots, M_u), u \le 2^32 - 2$
- Secret key : $k \in_R \{0, 1\} ^ {128}$, shared between Alice and Bob.

`Output` : $(IV, A, C, t)$ where
- $IV$ is a 96-bit initialization vector
- $A = (A_1, \dots, A_v)$ is the additional authenticated data
- $C = (C_1, \dots, C_u)$ is the encrypted / authenticated data
- $t$ is a 128-bit authentication tag

### Some features of AES-GCM
- Performs both authentication and encryption
- Supports `authentication only` (by using empty M)
- Very fast implementations on Intel and AMD processors because of sprcial `AES-NI` and `PCLMUL` instructions for the AES and $\cdot$ operations
- Encryption and decryption can be `parallelized`
- AES-GCM can be used in `streaming mode`
- The secret key can have bitlenght 128, 192 or 256
- Security is justified by a secure proof.

## 5.3 AWS KMS
- AWS global infrastructure
- Data centre security
- Hardware Security Modules (HSMs)
- AWS encryption and key management

### Encryption in the cloud : AWS
`AWS services` : 
- `Compute` : EC2 (Elastic Comptute Cloud)
- `Storage` : S3 (Simple Storage Service)
- `Database` : Aurora (relational database), DynamoDB (NoSQL database)
- `Security` : Identity and Access Management (IAM), Certificate Manager, CloudHSM, Key Management Service (KMS)

### AWS encryption
- `KMS` : Key Management Service
- `Data at rest`, for `all` data stored by `all` AWS services
- `Client-side/Server-side` encryption, where the AWS KMS generates and manages keys
- **Encrypt everything** : Each data item is encrypted with a *one-time* `data encryption key (DEK)`
    - Consequently, there are a *massive* number of encryption keys to manage (generation, storage, backup, retrieval, access control, deletion, )
- This naturally leads to the notion of `envelope encryption` :
    - Each client has a `Customer Main Key (CMK)`
    - The CMK is used to encrypt / decrypt DEKs
    - DEKs are used to encrypt / decrypt customer data
    - DEKs are deleted after usage

### Random IVs
- `NIST` : The IVs in GCM must fulfill the following "uniqueness" requirement : 
    - The probability that the authenticated encryption function ever will be invoked with the same IV and the same key on two (or more) distinct sets of input data shall be no greater than $2^{-32}$
- `Birthday paradox` : If $B$ IV's are drawn at random (with replacement) from $\{0, 1\} ^ {96}$, the probability that at least one string is selected two (or more) times is $\approx B^2 / (2 \cdot 2^{96})$
- So, at most $B = 2^{32}$ chunks should be encrypted with the same DEK *k* when IVs are selected at random

> The rest should be read by urself. Im dumb