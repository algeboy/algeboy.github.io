---
layout: post
title: "Direct and central decompositions of groups"
date: 2008-06-16 
author: "Prof. James B. Wilson"
excerpt: "Break down algebra"
---

Here's my story of one contribution I consider to be on the top of my list of contributions: an algorithm to efficiently break algebra into factors.  You can jump ahead if you like.

## Contents
- [Why groups?](#why-groups)
- [What is "feasible" in computational algebra?](#what-is-feasible-in-computational-algebra)
- [What is the $f$ in "$f$-polynomial time"?](#what-is-the-f-in-f-polynomial-time)
- [Central Decompositions](#central-decompositions)
- [Related work](#related-work)
- [Was the 2nd part of your article ever published?](#was-the-2nd-part-of-your-article-ever-published)

## What is factoring in algebra?

One way to deal with large data is to discover it is controllably built from smaller data.  The number $650=2\cdot 5^2\cdot 13$ gives us all the same information a 650 but broken down into much smaller number $2,5,13$.  

With algebra we can use the direct product.  Effectively the combines two or more algebras $H$ and $K$ occurring independently of one another combined as one $G=H\times K$.  Many problems get simpler if we are given an algebra $G$ and we manage to break it into a direct product $H\times K$ of smaller algebras.  If you want more think of $H\times K$ as ordered pairs.  Suppose you can multiply in $H$ and in $K$.  Then you can multiply in both by 
$$(h,k)*(h',k')=(h*h', k*k')$$
If you have an identity $1$ and inverses you can imaging extending those operations to pairs as well.  If you have properties of that multiplication, say **associative** $h_1*(h_2*h_3)=(h_1*h_2)*h_3$ then the pair has the property.  That configuration is known as a [group](https://en.wikipedia.org/wiki/Group_theory).

Here is what I proved.

**Theorem. (Wilson 2008)** Given a finite group $G$ represented feasibly there is a $f$-polynomial-time algorithm that returns a fully refined direct product decomposition 
$$G=H_1\times \cdots \times H_{\ell}.$$


### Why groups?
Groups have a history of being used which makes them a good target.  This backs the question up to "why are groups used".  I could guess about their significance in solving various mysteries and surely there are many reasons.  For my part I would say groups are special because they are a "recursive theory".  What I mean by that is every structure admits a group of automorphisms.  That means no matter what you study, you can frame some of the questions in terms of groups.  So the more you know about groups the more you know about things. 

There are other recursive algebraic theories: monoids and Lie algebras to name two.  For example every structure has a monoid of endomorphisms and every distributive product has a Lie algebra of derivations. Indeed these are two of the other most studied algebras.  So my answer to "why groups?"  They are a class of algebra you can always shoe-horn into your study.


### What is "feasible" in computational algebra?  
Well because the data is ultimately finite you could just guess and check for a very long time and find an answer.  But that is indeed a **very long time**.  An algebra as given by a bunch of operations (the multiplications, identities, inverses etc.).  If you have functions to apply these operations then the encoding is what we call **feasible** (or black-box if you want to be completely precise).  For example, in Java, C++, and nearly any programming language we can add integers really well.  We can multiply matrices, permutations, polynomials  Those are feasible.  

What might be infeasible is something like concatenating strings of letters subject to rewriting (e.g. maybe you know $ab=ba$ but $ac\neq ca$. So you could move $b$ around $a$ but not $c$).  While we can easily glue one string to the end of another, when we need to compare two strings we need to know of some rewriting makes them equal.  Once you start to rewrite you might have many choice of what to rewrite next.  And you might find yourself going in circles moving things around searching for a way to make them agree.  Unlike the finite assumptions of before, you really have no guarantee you can ever win the game.  Rewriting is so complex that there are not even enough algorithms to decide all of the possible ways to rewrite leaving some configurations **algorithmically undecideable**---no algorithm can exist to chase down if those strings are equal.  Don't think of this as a confusion as to whether these are equal or not, think of this as simply saying there are not enough programs to do everything we ask (a [Cantor Diagonalization](https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument) type behavior if you like).

## What is the $f$ in "$f$-polynomial time"? 
$f$ heres stand for "factorization oracle" it was a term invented by Lajos Ronyai.  It acknowledges that we don't yet know if we factor all polynomials, because that would require factoring integers as well and that seems hard on conventional computers.  In fact the groups $\mathbb{Z}/n=\mathbb{Z}/a\times \mathbb{Z}/b$ whenever $n=ab$.  So that means that the direct product problem we want to solve is at least as hard as factoring.  What my theorem shows is that it is no harder than that.  

It should be mentioned now that the original complexity of this problem was $2^{cn^2}$ where $n$ was the size of the input in a feasible model.  Factoring by the best methods takes $2^{\sqrt[3]{n}}$ so there was a substantial gap between these two problems.  We now know the complexity for group factorization is $\text{factor}(n)+O(n^6)$.  For example, if you can factor in polynomial time (e.g. in a quantum computer or because your numbers don't have large primes) then the whole project is polynomial time.

## Central Decompositions
A variation on this is what is known as a **central decomposition** where you find smaller parts that are controllably put together but they may have overlaps.  This is the next best thing if you can't find a complete "direct" factorization.  I solve this problem as well.

**Theorem. (Wilson 2008)** For given a finite $p$-group $G$ represented feasibly^$*$ there is a polynomial-time algorithm that returns a fully refined central product decomposition 
$$G=H_1\circ \cdots \circ H_{\ell}.$$

## Related work

My own work was built on reducing the decompositions to nilpotent $p$-groups.  It did so by doing a careful study of how direct products influence the structure of groups globally.  Within the $p$-group domain the remaining work was to factor a tensor of commutation.  This is where the connection was made to a body of model theory and work of Mal'cev an Miyasnikov that connect decomposition of tensors to commutative rings.  Finally the factorization of commutative rings was reducible to factoring polynomails to through several works of Ronyai, Gianni-Miller-Traeger, and even Berlekamp.

Inside the algorithms my work also made use of results of C. R. B. Wright and E.M. Luks 

**Theorem Luks, Wright 2006.** In a feasible computational model given a group $G$ and a subgroup $H$ there is a polynomial-time algorithm to decide if there is a $K$ such that $G=H\times K$.

It seems the time was right for this class of problem to be conquered.  A year after my own work, Kayal-Nezhmetdinov independently considered a special case of the direct product problem where the group operations are not given by algorithm but rather all their values are numerated.  This is known as the **Cayley Table Model** which is a special case of the **Regular Permutation Model** which is a special case of the feasible model.  They proved

**Theorem [KN09](#kn09)** For groups input by Cayley table there is a polynomial-time algorithm to decide if a group is a direct product of subgroups.

I confess in my youth I found it discouraging to have had proved this result earlier but the community didn't know about it.  Today I can see the other side of things where Kayal-Nezhmetdinov made an independent far more digestible account of a key case to the problem.  I think the time was right for this problem to be solved in any form and I am glad it got attention.  Understanding both methods gives a fuller picture.

### Was the 2nd part of your article ever published?

After writing a very [technical thesis](#w08-wilson-james-b-group-decompositions-jordan-algebras-and-algorithms-for-p-groups-dissertation-phd-university-of-oregon-june-2008) on the topic I wrote also a [long technical paper](#w10-wilson-james-b-finding-direct-product-decompositions-in-polynomial-time).  It was submitted and the reviewers' comments where to write more explanatory account in two parts.  I complied with the first part appearing in [W12d].  At that time I had already been distracted by this article for 3 years, was beginning a tenure track job with an infant at home and the editor contracted cancer and tragically passed away.  To write a comprehensive 2nd act to an unknown editor seemed at the time to be a dangerous trap for a young professor so I elected to leave it at the arXiv version which contains a full account in addition to the already existent thesis.

Should some enterprising person some day wish to make the subject of a master's or other thesis out of expanding on the second half I would enthusiastically support this. Surely there are many things now that could be said to enhance my approach and make new contributions.  

----

### [KN09] [Kayal, N., Nezhmetdinov, T. (2009). _Factoring Groups Efficiently._ In: Albers, S., Marchetti-Spaccamela, A., Matias, Y., Nikoletseas, S., Thomas, W. (eds) Automata, Languages and Programming. ICALP 2009. Lecture Notes in Computer Science, vol 5555. Springer, Berlin, Heidelberg.](https://doi.org/10.1007/978-3-642-02927-1_49)

### [W08] Wilson, James B. _Group Decompositions, Jordan Algebras, and Algorithms for p-Groups_, Dissertation, Ph.D University of Oregon, June 2008.  

### [W10] [Wilson, James B. _Finding direct product decompositions in polynomial time._
https://arxiv.org/abs/1005.0548](https://arxiv.org/abs/1005.0548)

### [W12d] [James B. Wilson, Existence, algorithms, and asymptotics of direct product decompositions, I Groups - Complexity - Cryptology 4 (2012), 33-72]()