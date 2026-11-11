---
title: "[CS432] Cryptography - Chapter 9"
date: 2026-11-11
description: "Bluetooth security"
series: "Cryptography Course"
seriesOrder: 8
---

# BLUETOOTH SECURITY

You can access to the course slides [here](https://cryptography101.ca/wp-content/uploads/Chapter9.pdf) so this is just my own notes

- 9.1 : Bluetooth
- 9.2 : Bluetooth security
- 9.3 : Bluetooth pairing
- 9.4 : Secure Connections / Numeric Comparison
- 9.5 : KNOB attack

## 9.1 Bluetooth
- Industry standard for short-range low-power wireless communication technology
- Primarily used to establish writeless personal area networks (WPANs)
- Bluetooth v1.0 released in 1999
- `Bluetooth v6.0` was released in 2024
- In 2025, over 5 billion Bluetooth products were shipped
- Two variants : `Classic` (BR/EDR), and `Low Energy` (BLE)
- We will discuss `Blue Classic` (The cryptographic differences with BLE are minor)
- The Bluetooth specification is over 3000 pages long, which makes a comprehensive security analysis very difficult

## 9.2 Bluetooth security
Five basic security services are specified in the Bluetooth standard :
- `Confidentiality` : prevent information compromise caused by eavesdropping by ensuring that onnly authorized devices can access and view transmitted data
- `Data integrity` : verifying that messages sent between two Bluetooth devices have not been altered in transit
- `Entity authentication` : verifying the identity of communicating devices based on their Bluetooth addresses
- `Authorization` : allowing the control of resources by ensuring that a device is authorized to use a service before permitting it to do so
- `Pairing` : creating one or more shared keys and the storing of  these keys for use in subsequent connections in order to form a trusted device pair

## 9.3 Bluetooth pairing
- To establish a long-term secure Bluetooth connection, the two devices have to `pair`
- Pairing produces a long-term `link key`, which is stored for later re-use
- The llink key is used to derive fresh `encryption keys` for each session
- There are three security mechanisms :
    - Legacy
    - Secure Simple Pairing
    - `Secure Connections`
    (Secure Simple Pairing and Secure Connections are very similar)

### Secure Connections 
Four association models depending on the I/O capabilities of the devices :
- `Numeric Comparison` : requires both devices to have displays for 6-digit numbers, andd each device to have either an "OK/Reject" confirmation button or a keyboard
- `PassKey Entry` : use when one device has a keyboard (and no display) amd tje pther device has a display, or when one device has a display only and the other device has a keyboard and display
- `Just Works` : designed for the situation where at least one of the pairing devices has neither a display nor a keyboard (e.g. headsets)
- `Out-of-Band` (vendor specific) : designed for devices that support a common additional wireless (e.g. NFC) or wired technology for the ppurpose of device discovery and cryptographic value exchange

We shall study `Numeric Comparison` : yay :

## 9.4 Secure Connections / Numeric Comparison
`Notation` :
- `P-256` : elliptic curve : $p, E, n, P$
- `Alice` : the initialing device
- `Bob` : the responder device
- $A, B$ : Alice's and Bob's 48-bit Bluetooth addresses
- $N_A, N_B$ : Alice's and Bob's randomly selected 128-bit nonces
- $C_B$ : Bob's commitment (to his nonce)
- $V_A, V_B$ : Alice's and Bob's 6-digit verification values 
- $E_A, E_B$ : Alice's and Bob's exchange confirmation values
- $LK$ : link key
- $S_A, S_B$ : Alice's and Bob's signed responses
- `ACO` : authenticated ciphering offset
- $K_E$ : encryption key

### Overview
`Phase 1 :` Public key exchange 
- *Purpose* : establish an (unauthenticated) shared secret
- After exchanging Bluetooth addresses $A$ and $B$, `ECDH` is used : 
    - Alice selects $x \in_R [1, n-1]$, computes $X = xP$, and sends $X$ to Bob
    - Bob selects $y \in_R [1, n-1]$, computes $Y = yP$, and sends $Y$ to Alice. Bob sets K to be the x-coordinate of $yX$
    - Alice sets $K$ to be the x-coordinate of $xY$
    - The `shared secret` is $K$ (256-bits)

`Phase 2 :` Authentication stage 1
- *Purpose* : provide some protection against active MITM attacks 
- `Methodology` : 
    - Bob selects `nonce` $N_B \in_R \{0,1\}^{128}$, computes a `commiment` $C_B = \text{HMAC-SHA-256}_{N_B}(Y, X), and sends $C_B$ to Alice
    - Alice selects `nonce` $N_A \in_R \{0, 1\}^{128}$, and sends $N_A$ to Bob
    - Bob sends $N_B$ to Alice
    - Alice checks if $C_B = \text{HMAC-SHA-256}_{N_B}(Y, X)$
    - Alice computes the `verification value` $V_A (\text{SHA-256}(X, Y, N_A, N_B) \mod{2^{32}}) \mod{10^{6}}$ and displays this 
    - Bob computes the `verification value` $V_B = (\text{SHA-256}(X, Y, N_A, N_B) \mod{2^{32}}) \mod{10^{6}}$, and displays this value
    - If $V_A = V_B$, the owner presses the `OK` button on *both* devices
- `Notes` : 
    - The use of commitment $C_B$ ensures that Alice and Bob select their nonces before seeing the other party's nonce
    - An active MITM attack will result in two 6-digit verification values $V_A, V)B$ being different with probability 0.999999
    
`Phase 3 :` Authentication state 2
- *Purpose* : Confirm that both devices have successfully completely the exchange and confirm the Bluetooth addresses
- `Methodology` : 
    - Alice computes `exchange confirmation value` $E_A$, the 128 *most* significant bits of $\text{HMAC-SHA-256}_K(N_A, N_B, A, B)$, and sends $E_A$ to Bob
    - Bob verifies that the 128 most signigicant bits of $\text{HMAC-SHA-256}_K(N_B, N_A, B, A)$, and sends $E_B$ to Alice
    - Alice verifies that the 128 most significant bits of $\text{HMAC-SHA-256}_K(N_B, N_A, B, A)$ are equal to $E_B$

`Phase 4 :` Link key calculation
- *Purpose* : Compute the long-term link key
- `Methodology` :
    - Both parties compute $LK$, the 128 most significant bits of $\text{HMAC-SHA-256}_K(N_A, N_B, \text{0x62746C6B}, A, B)$
- `Notes` : 
    - The link key is the long-term authentication key
    - The link key is used to maintain the pairing
    - The nonces $N_A, N_B$ ensure the freshness of the link key, even if long-term ECDH values $X, Y$ are used by both sides
    - $\text{0x62746C6B}$ is the ASCII representation of "btlk" ( I think it means "BlueToothLinkKey")

`Phase 5 :` Authentication and encryption
- *Purpose* : check that the devices hold the same link key (and thus are paired), and then derive a shared secret encryption key $K_E$, which is used to encrypt and authenticate data for that session
- `Methodology` :
    - Alice generates $R_A \in_R \{0, 1\}^{128}$ and sends $(A, R_A)$ to Bob
    - Bob generates $R_B \in_R \{0, 1\}^{128}$ and sends $(B, R_B)$ to Alice
    - Alice and Bob compute :
        - `Device authentication key` $h$, the 128 most significant bits $\text{HMAC-SHA-256}_{LK}(A, B)$
        - `Device authentication confirmation values` $t = \text{HMAC-SHA-256}_h(R_A, R_B)$, $S_A = \text{ leftmost 32 bits of } t, S_B = \text{ next 32 bits of } t, \text{ACO} = \text{ next 64 bits of } t$
        - Alice sends the `signed response` $S_A$ to Bob
        - Bob sends the `signed response` $S_B$ to Alice
        - Alice and Bob compare the signed responses they received with the values they computed
    - The `encryption key` $K_E$ derived may vary in length in single byte increments from 1 byte to 16 bytes. The length is set during a `negotiation process` that occurs between the two communicating devices
    - For 128-bit keys, $K_E$ is the most significant bits of $\text{HMAC-SHA-256}_{LK}(A, B, \text{ACO})$. For smaller $\ell$-bit keysm take the $\ell$-most significant bits, and set the remaining bits to 0
    - Encryption is performed using `AES-CCM` (CBC-MAC *then* AES-CTR encryption) with Secure Connections 

## 9.5 : KNOB attack
- The encryption key negotiation protocol is used by two Bluetooth devices to agree on the length of encryption keys $K_E$. This was introduced to cope with international encryption regulations and to facilitate security upgrades
- *The negotiation is neither authenticated nor encrypted*
- So, an active adversary can cause the devices to agree to produce an `8-bit key` $K_E$. This key can then be brute forced in real time (and thus confidentiality is lost)
- The attack was implemented, and used to decrypt an encrypted file exchanged over Bluetooth between a Nexus 5 phone and a Motorola G3 phone
- Most Bluetooth chips (Intel, Broadcom, Apple, ...) and devices were vulnerable to the attack
- `Countermeasure` : Set the key length to 128-bits

### Other attacks
- "Breaking the Bluetooth pairing - the fixed coordinate  
invalid curve attack", by Biham and Neumann. 
Available at: eprint.iacr.org/2019/1043
- "Method confusion attack on Bluetooth pairing",  
by von Tschirschnitz, Peuckert, Franzen and Grosslags, 
Proceedings of 2021 IEEE Security and Privacy Symposium.
- "SoK: The long journey of exploiting and defending the legacy of King 
Harald Bluetooth", by Wu, Wu, Xu, Tian and Bianchi, 
Proceedings of 2024 IEEE Security and Privacy Symposium