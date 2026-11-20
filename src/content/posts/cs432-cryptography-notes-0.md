---
title: "[CS432] Cryptography - Chapter 1"
date: 2026-11-18
description: "Course overview"
series: "Cryptography Course"
seriesOrder: 0
---

# SYMMETRIC-KEY ENCRYPTION

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter1.pdf) so this is just my own notes

*This lecture* : High-level overview of the course content, with many details omitted

*Course objective* : Fillin in the technical details and adding some context for a full understanding

## What is cryptography ?
Cryptography is about securing communications in the presence of `malicious` adversaries

The adversary is `malicious`, `powerful`, and `unpredictable`

`Adversarial capabilities` (more than eavesdropping) :
- Read data
- Modify data
- Inject data
- Delete data 

## Fundamental goals of cryptography 
`Confidentiality` : Keep data secret form all but those authorized to see it

`Data authentication` : 
- `Data integrity` : Prevent unauthorized modification of data
- `Data origin authentication` : Gain assurance of the source of data

`Entity authentication (and key establishment)` :
- Gain assurance that a party has participated in an innteraction
- Two parties establish a shared, secret, authenticated key

## Secure web transactions
- `Transport Layer Security (TLS)` : The cryptographic protocol used by web browsers to securely communicate with website such as Gmail and Facebookk

- TLS is used to assure an individual user (`client`) of the authenticity of the web site (`server`) they are visiting, adn to establish a `secure communication channel` for the remainder of the session

- `Symmetric-key cryptography` : The client and server are assumed to have some shared secret information $k$ called a `key`

- They can subsequently engage in secure communication by encryption and authenticating their communications using `AES-GCM`

**Question** : How do Alice and Bob establish the shared secret key $k$ ?

- `Public-key cryptography` : The client and server are assumed to have some shared `authenticated` (but non-secret) information

- To establish a secret key, Alice selects the secret `session key` $k$, and encrypts it with Bob's `RSA public key`. Then only Bob can decrypt the resulting ciphertext with his `RSA private key` to recover $k$. 

**Question** : How does Alice obtain an authentic copy of Bob's RSA public key ?

- `Signature scheme` : Bob's RSA public key is signed by a `Certification Authority` (CA) using its secret signing key with the `RSA signature scheme` 

- Alice can verify the signature using the CA's `RSA public verification key`. In this way, Alice obtains an authentic copy of Bob's RSA public key

**Question** : How does Alice obtain an authentic copy of CA's RSA public key ?

**Answer** : The CA's RSA public key is embedded in Alice's browser

## The TLS protocol (simplified)
When a client first visits a secured web page, the server transmits its `certificate` to the client :
- The ceritifcate contains the server's identifying information (e.g. the website name and URL) and RSA public key, and the RSA signature of a `certifciation authority`
- The certification authority (e.g. `Let's Encrypt` or `DigiCert`) is trusted to carefully verify the server's identity before issuing the certificate

Upon receipt of the certifficate, the client `verifies` the signature using the certification authority's public key, which is embedded in the browser. A successful verification confirms the `authencity` of the server and of its RSA public key

The client selects a random `session key $k$` encrypts it with the server's RSA public key, and transmits the resulting ciphertext to the server's RSA public key, and transmits the resulting ciphertext to the server

The server `decrypts` the ciphertext to obtain the session key `k`, which is then used with symmetric-key encryption shcemes to encrypt and authenticate (with `EAS-GCM`) all sensitive data exchanges for the remainder of the session

## Why cryptography is hard in practive
Many **powerful adversaries**, including :
- Graduate students
- Cryptography researchers (including professors)
- Organized crime
- Hackers
- Nation states (e.g. NSA : National Security Agency)

**Physics** :
- Quantum computers
- RSA and elliptic curve cryptography are easily broken using large-scale quantum computers
- *Post-quantum cryptography* : including hash-based signatures and lattice-based cryptosystems

**Artificial intelligence (AI)**
- ???
- *Post-AI cryptography*

**Key management and related trust infrastructure**

**Algorithm agility**

**Weak random number generation**

**Efficient implementaions
- Software
- Hardware

**Secure implementations**
- resistance to side-channel attacks (e.g. timing attacks)

## Cryptography in context
`Cybersecurity` consists of the concepts, technical measures, and administrative measures used to protect networks, computers, programs and data from deliberate or inadvertent unauthorized access, disclosure, manipulation, or use.

Also known as `information security`

## Cybersecurity
`Computer Security` :
- Security models and policies
- Secure operating systems
- Virus protection
- Auditing mechaisms
- Risk analysis
- Risk management

`Network security` :
- Internet protocols
- Viruses and worms
- Denial-of-service : Dos
- Firewalls
- Intrusion detection
- Wireless communications

`Software security` :
- Buffer overflows
- Programming languages and compilers
- Digital rights management
- Code obfuscation
- Trusted computing

## Cryptography $\neq$ Cybersecurity
Cryptography provides some mathematical tools that can assist with the provision of cybersecurity services. It is a *small*, although an *indispensable*, part of a complete security solution

`Security is a chain` :
- Weak links become targets : one flaw is all it takes
- *Cryptography is usually not the weakest link* : However, when the cryptography fails, the damage can be catastrophic

`This course will focus on cryptography`
