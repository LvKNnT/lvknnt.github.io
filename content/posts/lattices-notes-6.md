---
title: Lattices, LWE and Post-Quantum Cryptography - Chapter 6
date: 2026-10-07
description: Lattice trapdoors, Gaussian preimage sampling, and the security of hash-and-sign signatures.
series: Lattice Notes
seriesOrder: 6
---

# Chapter 6

## Trapdoors, Gaussian Sampling and Digital Signatures

A lattice trapdoor lets its owner solve LWE or find short SIS preimages for a public matrix that looks random. This chapter constructs such trapdoors, uses them to invert functions, and explains why secure signatures need a more careful operation: sampling a preimage from a distribution that hides the trapdoor.

The chapter uses the $\ell_\infty$ norm:

$$
\|\mathbf x\|_\infty=\max_i|x_i|.
$$

For matrix bounds below, write $\|\mathbf T\|_{\max}=\max_{i,j}|T_{ij}|$. This is the entrywise bound used in the lecture, not the induced maximum-row-sum norm. In particular,

$$
\|\mathbf e^T\mathbf T\|_\infty
\le m\|\mathbf e\|_\infty\|\mathbf T\|_{\max}
\qquad(\mathbf T\in\mathbb Z^{m\times m}).
$$

The Gaussian density still uses the Euclidean squared length:

$$
\rho_s(\mathbf x)=e^{-\pi\|\mathbf x\|_2^2/s^2}.
$$

## Lattice Trapdoors

Recall the integer kernel lattice

$$
\Lambda^\perp(\mathbf A)
:=
\{\mathbf z\in\mathbb Z^m:
\mathbf A\mathbf z=\mathbf0\pmod q\},
\qquad
\mathbf A\in\mathbb Z_q^{n\times m}.
$$

It has rank $m$ over $\mathbb R$, since it contains $q\mathbb Z^m$.

**Definition 22.** A $\beta$-good trapdoor is a matrix $\mathbf T\in\mathbb Z^{m\times m}$ such that:

1. $\mathbf A\mathbf T=\mathbf0\pmod q$.
2. Every column $\mathbf t_i$ satisfies $\|\mathbf t_i\|_\infty\le\beta$.
3. $\operatorname{rank}_{\mathbb R}(\mathbf T)=m$.

The columns are $m$ short, linearly independent SIS solutions. They need not generate the entire kernel lattice for this definition.

Full real rank and a nontrivial modular kernel are compatible. For example, $q\mathbf I_m$ is invertible over $\mathbb R$ but is the zero matrix modulo $q$. When $q$ is prime and $\mathbf A$ has full row rank, its modular kernel has dimension $m-n$; for composite $q$, it is a module and ordinary field-rank terminology needs care.

## Trapdoor Sampling

### Lemma 23: Leftover Hash Lemma

The lecture uses the following extraction principle:

$$
(\mathbf A,\mathbf A\mathbf e\bmod q)
\approx_\varepsilon
(\mathbf A,\mathbf u),
$$

where $\mathbf A$ is uniform, $\mathbf u\leftarrow\mathbb Z_q^n$ is independent and uniform, and the input distribution has enough min-entropy:

$$
H_\infty(\mathbf e)
\ge n\log_2q+2\log_2(1/\varepsilon).
$$

Here $H_\infty(X)=-\log_2\max_x\Pr[X=x]$. The matrix remains public: the output is nearly uniform even given $\mathbf A$.

**Scope of the statement.** Entropy over arbitrary integers is not sufficient by itself: a distribution supported on $q\mathbb Z^m$ always hashes to zero. The input residues and hash family must satisfy the usual universality hypotheses. The binary sources used below do: two distinct binary vectors differ by $\pm1$ in some coordinate, so a uniform matrix maps their difference to zero with probability $q^{-n}$, even for composite $q$.

For a universal family, the standard distance bound is

$$
\Delta\le
\frac12\sqrt{q^n\,2^{-H_\infty(\mathbf e)}}.
$$

Substituting the entropy requirement gives $\Delta\le\varepsilon/2\le\varepsilon$.

### Sampling One Short Kernel Vector

Choose

$$
\mathbf A'\leftarrow\mathbb Z_q^{n\times(m-1)},
\qquad
\mathbf r\leftarrow\{0,1\}^{m-1},
$$

and output

$$
\mathbf A=[\,\mathbf A'\mid-\mathbf A'\mathbf r\,],
\qquad
\mathbf t=\begin{pmatrix}\mathbf r\\1\end{pmatrix}.
$$

Correctness is immediate:

$$
\mathbf A\mathbf t
=\mathbf A'\mathbf r-\mathbf A'\mathbf r
=\mathbf0\pmod q,
\qquad
\|\mathbf t\|_\infty=1.
$$

Since $H_\infty(\mathbf r)=m-1$, the matrix is $\varepsilon$-close to uniform when

$$
m-1\ge n\log_2q+2\log_2(1/\varepsilon).
$$

#### Exercise: Why Repeating This Does Not Give a Full Trapdoor

Start with $\mathbf B\in\mathbb Z_q^{n\times m_0}$ and binary
$\mathbf R\in\{0,1\}^{m_0\times k}$. Then

$$
\mathbf A=[\,\mathbf B\mid-\mathbf B\mathbf R\,],
\qquad
\mathbf T_{\mathrm{partial}}
=\begin{pmatrix}\mathbf R\\\mathbf I_k\end{pmatrix}
$$

satisfies $\mathbf A\mathbf T_{\mathrm{partial}}=0$. Its $k$ columns are independent because of the identity block. However, $\mathbf A$ now has $m_0+k$ columns, so the trapdoor is always $m_0$ vectors short of full rank. Adding another column and another relation never closes this deficit.

### Inhomogeneous Trapdoors

Set

$$
d=\lceil\log_2q\rceil,\qquad w=nd,
\qquad
\mathbf G=\mathbf I_n\otimes(1,2,\ldots,2^{d-1})
\in\mathbb Z_q^{n\times w}.
$$

Instead of immediately finding a full kernel basis, first find a small matrix
$\mathbf S\in\mathbb Z^{m\times w}$ with

$$
\mathbf A\mathbf S=\mathbf G\pmod q.
$$

This transforms an LWE sample into one relative to the easy gadget matrix:

$$
\mathbf b^T\mathbf S
=(\mathbf s^T\mathbf A+\mathbf e^T)\mathbf S
=\mathbf s^T\mathbf G+\mathbf e^T\mathbf S\pmod q.
$$

For inhomogeneous SIS with target $\mathbf v$, compute
$\mathbf u=\mathbf G^{-}(\mathbf v)\in\{0,1\}^w$ and output
$\mathbf e=\mathbf S\mathbf u$. Then

$$
\mathbf A\mathbf e
=\mathbf G\mathbf u
=\mathbf v\pmod q,
\qquad
\|\mathbf e\|_\infty\le w\|\mathbf S\|_{\max}.
$$

This solves the SIS exercise left to the reader.

### A Short Trapdoor for the Gadget

For $q=2^d$, let $\mathbf g=(1,2,\ldots,2^{d-1})$ and

$$
\mathbf T_{\mathbf g}
=
\begin{pmatrix}
2&0&\cdots&0\\
-1&2&\cdots&0\\
0&-1&\ddots&\vdots\\
\vdots&\ddots&\ddots&2
\end{pmatrix}.
$$

The intended matrix has $2$ on the diagonal, $-1$ immediately below it, and zeros elsewhere. Its first $d-1$ columns give
$2\cdot2^{j-1}-2^j=0$; the last gives $2^d=q$. Thus

$$
\mathbf g\mathbf T_{\mathbf g}=(0,\ldots,0,q)
=\mathbf0\pmod q,
\quad
\|\mathbf T_{\mathbf g}\|_{\max}\le2,
\quad
\det(\mathbf T_{\mathbf g})=2^d=q.
$$

For example, when $q=8$,

$$
(1,2,4)
\begin{pmatrix}
2&0&0\\
-1&2&0\\
0&-1&2
\end{pmatrix}
=(0,0,8).
$$

For a non-power-of-two modulus, write

$$
q=\sum_{j=0}^{d-1}q_j2^j,\qquad q_j\in\{0,1\},
$$

and replace the last column by $(q_0,\ldots,q_{d-1})^T$. The gadget product is again $(0,\ldots,0,q)$.

**Determinant exercise.** The cofactor of the entry in row $j+1$ of the last column is $2^j$. Expanding that column gives

$$
\det(\mathbf T_{\mathbf g})
=\sum_{j=0}^{d-1}2^jq_j=q.
$$

For $q=7$, this is the concrete calculation

$$
\mathbf T_{\mathbf g}
=
\begin{pmatrix}
2&0&1\\
-1&2&1\\
0&-1&1
\end{pmatrix},
\qquad
\det(\mathbf T_{\mathbf g})=4+2+1=7.
$$

Finally set

$$
\mathbf T_{\mathbf G}=\mathbf I_n\otimes\mathbf T_{\mathbf g}.
$$

Then $\mathbf G\mathbf T_{\mathbf G}=0\pmod q$,
$\|\mathbf T_{\mathbf G}\|_{\max}\le2$, and
$\det(\mathbf T_{\mathbf G})=q^n$.

### Sampling a Random-Looking Matrix with an Inhomogeneous Trapdoor

Choose independently

$$
\mathbf B\leftarrow\mathbb Z_q^{n\times m_0},
\qquad
\mathbf R\leftarrow\{0,1\}^{m_0\times w},
\qquad
m=m_0+w,
$$

and set

$$
\mathbf A=[\,\mathbf B\mid\mathbf B\mathbf R+\mathbf G\,],
\qquad
\mathbf S=\begin{pmatrix}-\mathbf R\\\mathbf I_w\end{pmatrix}.
$$

The trapdoor equation is

$$
\mathbf A\mathbf S
=-\mathbf B\mathbf R+\mathbf B\mathbf R+\mathbf G
=\mathbf G\pmod q.
$$

Each column of $\mathbf B\mathbf R$ is a leftover-hash output. A hybrid over $w$ columns bounds the joint distance from uniform by $w\varepsilon_0$. For total distance at most $\varepsilon$, it suffices to choose

$$
m_0\ge n\log_2q+2\log_2(w/\varepsilon).
$$

Adding the fixed matrix $\mathbf G$ preserves uniformity.

### Constructing the Full Trapdoor

Let

$$
\mathbf D:=\mathbf G^{-}(\mathbf B)\in\{0,1\}^{w\times m_0},
\qquad
\mathbf G\mathbf D=\mathbf B\pmod q.
$$

Two block transformations give

$$
\mathbf A
\begin{pmatrix}
\mathbf I_{m_0}&-\mathbf R\\
\mathbf0&\mathbf I_w
\end{pmatrix}
=[\,\mathbf B\mid\mathbf G\,]
$$

and

$$
[\,\mathbf B\mid\mathbf G\,]
\begin{pmatrix}
\mathbf I_{m_0}&\mathbf0\\
-\mathbf D&\mathbf T_{\mathbf G}
\end{pmatrix}
=[\,\mathbf0\mid\mathbf0\,]\pmod q.
$$

Their product is the trapdoor

$$
\boxed{
\mathbf T_{\mathbf A}
=
\begin{pmatrix}
\mathbf I_{m_0}+\mathbf R\mathbf D&
-\mathbf R\mathbf T_{\mathbf G}\\
-\mathbf D&\mathbf T_{\mathbf G}
\end{pmatrix}.
}
$$

It has the three required properties:

- **Kernel:** $\mathbf A\mathbf T_{\mathbf A}=0\pmod q$ by the identities above.
- **Shortness:** the binary matrix products have entries bounded by $O(w)$, so $\|\mathbf T_{\mathbf A}\|_{\max}=O(m)$.
- **Real rank:** the first block factor has determinant $1$ and the second has determinant $q^n$, so $\det(\mathbf T_{\mathbf A})=q^n\ne0$.

In fact $\mathbf A$ is surjective modulo $q$, since $\mathbf A\mathbf S=\mathbf G$ and the gadget is surjective. Consequently,
$\det(\Lambda^\perp(\mathbf A))=q^n$. The generated sublattice has that same determinant, so this construction yields a basis of the entire kernel lattice.

## Trapdoor Functions

**Definition 24.** A trapdoor function family has efficient generation, evaluation, and inversion algorithms. Generation produces a public function index and a secret trapdoor. Evaluation computes $y=f_i(x)$. Given the trapdoor, inversion finds some preimage of any $y$ in the image. The cryptographic requirement is that inversion without the trapdoor is hard on the specified input distribution.

### Injective Function from LWE

Define

$$
f_{\mathbf A}(\mathbf s,\mathbf e)
=\mathbf s^T\mathbf A+\mathbf e^T\pmod q,
\qquad
\|\mathbf e\|_\infty\le E.
$$

Let $\mathbf T$ be a full-rank trapdoor with $\|\mathbf T\|_{\max}\le\beta$.
Multiplying an output $\mathbf b^T$ by $\mathbf T$ eliminates the secret:

$$
\mathbf b^T\mathbf T=\mathbf e^T\mathbf T\pmod q.
$$

Since

$$
\|\mathbf e^T\mathbf T\|_\infty\le mE\beta,
$$

the sufficient condition $mE\beta<q/2$ ensures that taking centered representatives modulo $q$ recovers the integer vector $\mathbf e^T\mathbf T$. Then

$$
\mathbf e^T=(\mathbf e^T\mathbf T)\mathbf T^{-1}
$$

over $\mathbb Q$ recovers the error exactly. Finally solve

$$
\mathbf s^T\mathbf A=\mathbf b^T-\mathbf e^T\pmod q.
$$

For surjective $\mathbf A$, the map $\mathbf s\mapsto\mathbf s^T\mathbf A$ is injective, so this determines $\mathbf s$. The source uses the stronger margin $mE\beta\le q/4$.

**Why the function is injective.** Equal outputs imply equal centered products with $\mathbf T$, hence equal errors. Subtracting those errors gives equal secrets. For Gaussian errors, this argument applies on a bounded domain obtained by truncating negligible tails.

### Surjective Function from SIS

Define

$$
g_{\mathbf A}(\mathbf e)=\mathbf A\mathbf e\pmod q
$$

on a sufficiently large bounded set of short integer vectors.

> **Source correction.** Page 54 prints $\mathbf T\mathbf e$ in this definition. The public map is $\mathbf A\mathbf e$; $\mathbf T$ is its secret inversion aid.

Given a target $\mathbf v$, first use modular linear algebra to find any integer $\mathbf w$ satisfying $\mathbf A\mathbf w=\mathbf v\pmod q$. It need not be short. Set

$$
\begin{aligned}
\mathbf e
&=\mathbf T\{\mathbf T^{-1}\mathbf w\}\\
&=\mathbf w-\mathbf T\lfloor\mathbf T^{-1}\mathbf w\rfloor,
\end{aligned}
$$

where braces mean the coordinate-wise fractional part.

This is an integer vector, and

$$
\mathbf A\mathbf e
=\mathbf A\mathbf w-
\mathbf A\mathbf T\lfloor\mathbf T^{-1}\mathbf w\rfloor
=\mathbf v\pmod q.
$$

Every fractional coordinate lies in $[0,1)$, so

$$
\|\mathbf e\|_\infty\le m\beta.
$$

With $\beta=O(m)$, this gives the lecture's $O(m^2)$ preimage bound. This is Babai's rounding idea: subtract a lattice vector while keeping the same syndrome.

The shorter gadget route is

$$
\mathbf u=\mathbf G^{-}(\mathbf v),
\qquad
\mathbf e=
\begin{pmatrix}-\mathbf R\\\mathbf I_w\end{pmatrix}\mathbf u.
$$

It satisfies $\mathbf A\mathbf e=\mathbf v$ and $\|\mathbf e\|_\infty\le w$.

> **Sign correction.** For $\mathbf A=[\,\mathbf B\mid\mathbf B\mathbf R+\mathbf G\,]$, the upper block must be $-\mathbf R$. The positive sign on pages 54–55 does not satisfy the displayed equation.

Finding a short preimage of a random syndrome is inhomogeneous SIS. To reduce successful inversion to homogeneous SIS, sample a hidden short $\mathbf e_0$, give the inverter $\mathbf A\mathbf e_0$, and subtract its output $\mathbf e_1$:

$$
\mathbf A(\mathbf e_1-\mathbf e_0)=0.
$$

The difference is short; it is nonzero with high probability when the preimage distribution retains sufficient conditional min-entropy. This entropy condition matters because returning the same preimage would produce zero.

## Digital Signatures

### The Naïve Hash-and-Sign Scheme

Let $\mu$ denote a message, reserving $m$ for the lattice dimension.

1. **Key generation:** sample $(\mathbf A,\mathbf T)$. Publish $\mathbf A$ and keep $\mathbf T$.
2. **Signing:** hash $\mu$ to $\mathbf v=H(\mu)\in\mathbb Z_q^n$, then use the trapdoor to produce a short $\boldsymbol\sigma$ with $\mathbf A\boldsymbol\sigma=\mathbf v$.
3. **Verification:** check

   $$
   \mathbf A\boldsymbol\sigma=H(\mu)\pmod q,
   \qquad
   \|\boldsymbol\sigma\|_\infty\le B_{\mathrm{sig}}.
   $$

For the elementary inversion above, $B_{\mathrm{sig}}$ can be $O(m^2)$.
The norm check is essential: ordinary modular linear algebra finds unrestricted preimages.

### Why Deterministic Inversion Leaks the Trapdoor

With the gadget inverter, a signature is

$$
\boldsymbol\sigma
=
\begin{pmatrix}-\mathbf R\\\mathbf I_w\end{pmatrix}
\underbrace{\mathbf G^{-}(H(\mu))}_{\mathbf u\text{ is public}}.
$$

Its upper block reveals $-\mathbf R\mathbf u$. After collecting signatures on $k$ messages, stack the public decompositions and upper blocks:

$$
\mathbf U=[\,\mathbf u_1\mid\cdots\mid\mathbf u_k\,],
\qquad
\mathbf Y=-\mathbf R\mathbf U.
$$

If $\mathbf U$ has row rank $w$, choose a right inverse $\mathbf V$ with
$\mathbf U\mathbf V=\mathbf I_w$. Then

$$
\boxed{\mathbf R=-\mathbf Y\mathbf V.}
$$

Thus sufficiently many independent signature equations reveal the signing trapdoor. The source also points to attacks on geometric inversion methods: choosing a short preimage according to secret basis geometry can disclose that geometry.

### The Fix: Gaussian Preimage Sampling

For a syndrome $\mathbf v$, define its affine kernel coset

$$
\Lambda^\perp_{\mathbf v}(\mathbf A)
=\{\mathbf e\in\mathbb Z^m:\mathbf A\mathbf e=\mathbf v\pmod q\}.
$$

Replace deterministic inversion by

$$
\operatorname{PreSamp}(\mathbf A,\mathbf T,\mathbf v)
\approx_s
D_{\Lambda^\perp_{\mathbf v}(\mathbf A),s}.
$$

The target distribution depends on $\mathbf A,\mathbf v$, and a fixed public width $s$. It does not depend on which valid trapdoor was used.

The key joint-distribution requirement is

$$
\begin{aligned}
&\bigl(\mathbf e\leftarrow D_{\mathbb Z^m,s},
       \ \mathbf v=\mathbf A\mathbf e\bmod q\bigr)\\
&\qquad\approx_s
\bigl(\mathbf v\leftarrow\mathbb Z_q^n,
       \ \mathbf e\leftarrow\operatorname{PreSamp}(\mathbf A,\mathbf T,\mathbf v)\bigr).
\end{aligned}
$$

It combines two facts: the syndrome of a sufficiently wide Gaussian is nearly uniform, and its conditional distribution given a syndrome is exactly the discrete Gaussian on that coset.

The guarantee must hold for a fixed good public matrix, uniformly over the relevant trapdoors and targets. If one sample has statistical error $\delta$, a hybrid bounds the error for $Q$ adaptive sampling calls by $Q\delta$. Negligible $\delta$ therefore supports polynomially many signatures.

The Gaussian signature bound is chosen from a tail estimate. With
$t=\omega(\sqrt{\log\lambda})$ and polynomial dimension $m$,
$B_{\mathrm{sig}}=st$ suffices with negligible rejection probability. Its exact value need not equal the naïve scheme's $m^2$.

### Security Proof Sketch in the Random Oracle Model

The lecture says that this proof was given in class. The following supplies the reduction for a fresh-message forgery.

Given a random SIS matrix $\mathbf A$, a simulator has no trapdoor. For each new random-oracle query $\mu$, it instead:

1. Samples $\mathbf e_\mu\leftarrow D_{\mathbb Z^m,s}$ within the signature bound.
2. Programs $H(\mu):=\mathbf A\mathbf e_\mu\pmod q$.
3. Stores $\mathbf e_\mu$ and returns it if asked to sign $\mu$.

Use cached signatures for repeated signing queries in this proof. This specifies the signing behavior and avoids incorrectly treating repeated copies of one sample as fresh independent samples.

The preimage-sampling identity makes the simulated hash-and-sign transcript statistically close to a real one. Suppose a successful forger outputs a signature $\boldsymbol\sigma^*$ on an unsigned message $\mu^*$. Then

$$
\mathbf A\boldsymbol\sigma^*
=H(\mu^*)
=\mathbf A\mathbf e_{\mu^*}\pmod q.
$$

Output

$$
\mathbf z=\boldsymbol\sigma^*-\mathbf e_{\mu^*},
\qquad
\|\mathbf z\|_\infty\le2B_{\mathrm{sig}}.
$$

Because $\mu^*$ was not signed, its stored preimage was hidden. Large conditional min-entropy makes
$\boldsymbol\sigma^*=\mathbf e_{\mu^*}$ negligibly likely, so $\mathbf z$ is a nonzero SIS solution. A forgery without a prior query for $H(\mu^*)$ has only the negligible chance of guessing the independent syndrome.

The essential improvement is the simulator's ability to produce the same signature distribution without knowing a trapdoor.

## Discrete Gaussian Sampling

### Lemma 25: Rounding a Continuous Gaussian Is Biased

For the one-dimensional density

$$
N_s(x)=\frac1s e^{-\pi x^2/s^2},
$$

nearest-integer rounding assigns zero probability mass

$$
\begin{aligned}
\Pr[\operatorname{Round}(N_s)=0]
&=\frac1s\int_{-1/2}^{1/2}e^{-\pi x^2/s^2}\,dx\\
&=\frac1s-\frac{\pi}{12s^3}+O(s^{-5}).
\end{aligned}
$$

The expansion uses $e^{-u}=1-u+O(u^2)$ and
$\int_{-1/2}^{1/2}x^2dx=1/12$.

In contrast, Poisson summation gives

$$
\rho_s(\mathbb Z)
=s\left(1+2\sum_{k\ge1}e^{-\pi s^2k^2}\right),
$$

so

$$
\Pr[D_{\mathbb Z,s}=0]
=\frac1s+O(e^{-\pi s^2}/s).
$$

Comparing the event $\{0\}$ proves

$$
\Delta(D_{\mathbb Z,s},\operatorname{Round}(N_s))
\ge
\frac{\pi}{12s^3}-O(s^{-5})
=\Omega(s^{-3}).
$$

**Interpretation.** For polynomial $s$, this discrepancy is inverse polynomial rather than negligible. With exponentially large $s$, it can be negligible, explaining the crude sampler in Chapter 4.

> **Constant clarification.** Lemma 25 is printed as “at least $1/s^3$,” but the displayed proof establishes an $\Omega(1/s^3)$ bound. The calculation above makes the constant in the single-event argument explicit.

### Rejection Sampling over the Integers

Take $t=\omega(\sqrt{\log\lambda})$ and

$$
\mathcal I=\mathbb Z\cap[-ts,ts].
$$

Repeatedly draw $z$ uniformly from $\mathcal I$ and accept it with probability

$$
\rho_s(z)=e^{-\pi z^2/s^2}.
$$

Conditional on acceptance,

$$
\Pr[\text{output }z]
=
\frac{|\mathcal I|^{-1}\rho_s(z)}
{\sum_{u\in\mathcal I}|\mathcal I|^{-1}\rho_s(u)}
=\frac{\rho_s(z)}{\rho_s(\mathcal I)}.
$$

This is exactly the normalized truncated discrete Gaussian in the ideal arithmetic model. Finite-precision acceptance probabilities must be computed accurately enough to add only negligible statistical error.

### Lemma 26: Tail Bound

The source states

$$
\Pr_{X\leftarrow D_{\mathbb Z,s}}[|X|>ts]
\le c e^{-\pi t^2}
$$

for an absolute constant $c$, in the above-smoothing regime.

A direct Chernoff calculation yields $c=2$. For $a>0$, complete the square:

$$
\mathbb E[e^{aX}]
=
e^{a^2s^2/(4\pi)}
\frac{\rho_{s,\,as^2/(2\pi)}(\mathbb Z)}
{\rho_s(\mathbb Z)}
\le e^{a^2s^2/(4\pi)}.
$$

The last inequality follows from Poisson summation: shifted Gaussian mass on $\mathbb Z$ is maximized at an integer center, since every Fourier cosine is at most $1$. Markov's inequality and the choice $a=2\pi t/s$ give

$$
\Pr[X>ts]
\le e^{-ats+a^2s^2/(4\pi)}
=e^{-\pi t^2}.
$$

Apply the same argument to $-X$ and sum the two tails. For the chosen $t$, this is negligible, so truncation changes the distribution by only a negligible amount.

### Expected Runtime: Solving the Sampling Exercise

For $s,t\ge1$, a uniform candidate from $[-ts,ts]\cap\mathbb Z$ lies in
$[-s,s]\cap\mathbb Z$ with probability $\Omega(1/t)$. Every such candidate is accepted with probability at least $e^{-\pi}$.

Therefore

$$
\Pr[\text{accept in one trial}]=\Omega(1/t),
\qquad
\mathbb E[\text{number of trials}]=O(t).
$$

Alternatively, the exact acceptance probability is
$\rho_s(\mathcal I)/|\mathcal I|\approx s/(2ts)=1/(2t)$.
After $O(t\log(1/\delta))$ trials, the chance of not terminating is at most $\delta$.

### Klein–GPV Sampler: Supplement to the Lecture

The PDF omits the demonstration. This supplement follows [Gentry, Peikert, and Vaikuntanathan, Section 3.2](https://www.cs.toronto.edu/~vinodv/trapcvp.pdf).

Given a basis $\mathbf B$ with Gram–Schmidt vectors $\widetilde{\mathbf b}_i$, initialize $\mathbf c_m=\mathbf c$. For $i=m,\ldots,1$, use

$$
c_i=\frac{\langle\mathbf c_i,\widetilde{\mathbf b}_i\rangle}
{\|\widetilde{\mathbf b}_i\|_2^2},
\qquad
z_i\leftarrow D_{\mathbb Z,\,s/\|\widetilde{\mathbf b}_i\|_2,\,c_i},
\qquad
\mathbf c_{i-1}=\mathbf c_i-z_i\mathbf b_i.
$$

Output $\sum_i z_i\mathbf b_i$. This randomizes Babai's nearest-plane choices. A sufficient width is

$$
s\ge\max_i\|\mathbf b_i\|_2\,
\omega(\sqrt{\log m}).
$$

Smoothing makes translated sublattice masses nearly equal. Recursively sampling planes by Gaussian distance therefore approximates $D_{\mathcal L(\mathbf B),s,\mathbf c}$.

For a preimage, find $\mathbf w$ with $\mathbf A\mathbf w=\mathbf v$, then use the kernel basis to sample

$$
\mathbf y\leftarrow D_{\Lambda^\perp(\mathbf A),s,-\mathbf w},
\qquad
\mathbf e=\mathbf w+\mathbf y.
$$

Then $\mathbf A\mathbf e=\mathbf v$ and its weight is proportional to
$e^{-\pi\|\mathbf e\|_2^2/s^2}$.

## Exercises, Source Corrections, and Takeaway

Chapter 6 contains no numbered open problems. The worked arguments above complete its exercises: the rank deficit in naïve trapdoor generation, the gadget determinant for general $q$, inhomogeneous SIS inversion, and rejection-sampling correctness and runtime.

The important corrections are the public map $\mathbf A\mathbf e$, the negative sign in the gadget trapdoor, the normalized rejection distribution, and the asymptotic constant in Lemma 25.

The chapter's central lesson is that finding a short preimage is sufficient for inversion, but signatures must also control which preimage is exposed. Gaussian preimage sampling gives a public, basis-independent target distribution, making signing simulatable without the secret trapdoor and enabling the SIS security reduction.
