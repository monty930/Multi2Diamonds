pn
$\mathfrak{\color{cyan}{|}}$
[player_nick_S],[player_nick_W],[player_nick_N],[player_nick_E]
$\mathfrak{\color{cyan}{|}}$
st
$\mathfrak{\color{red}{||}}$
md
$\mathfrak{\color{cyan}{|}}$
[dealer][cards of S],[cards of W],[cards of N],
$\mathfrak{\color{cyan}{|}}$
rh
$\mathfrak{\color{red}{||}}$
ah
$\mathfrak{\color{cyan}{|}}$
[nazwa boarda]
$\mathfrak{\color{cyan}{|}}$
sv
$\mathfrak{\color{cyan}{|}}$
[vul]
$\mathfrak{\color{cyan}{|}}$
\[bids\]
$\mathfrak{\color{cyan}{|}}$
[game record]
$\mathfrak{\color{cyan}{|}}$

- What I stil do not know: "pn", "rh", "ah", "sv"
maybe tells if MP/IMP? All tables I've seen had those values unchanged

- [dealer]: 1 - S, 2 - W, 3 - N, 4 - E

- [cards of X] in format: S---H---D---C---

  note that there is a coma after N-th player's cards

- [vul]: o = none, n = NS, b = both, e = EW

- \[bids\]:
mb|\[bid\]|mb|bid|mb...

  Example:
  mb|3H|mb|p|mb|4H|mb|d|mb|p|mb|4S|mb|d|mb|p|mb|p|mb|p

  if bid is alerted: mb|\[bid!\]|an|[alert message]

  example:
  mb|1H|mb|p|mb|2N!|an|inv+fit|mb|p|mb|4H|mb|p|mb|p|mb|p

- [game record]

  Successive tricks divided with pg, next cards divided with pc, claim = mc and number of tricks claimed after that

  Example:

  pg||pc|DQ|pc|D3|pc|D2|pc|DA|pg||pc|H2|pc|H4|pc|HA|pc|H8|pg||pc|DK|pc|D5|pc|S4|pc|D4|pg||pc|DT|pc|D6|pc|HT|pc|D7|pg||pc|H3|pc|D8|pc|HK|pc|HQ|pg||pc|S5|pc|SA|pc|ST|pc|S2|pg||pc|S3|pc|SK|pc|S7|pc|S6|pg||pc|H5|pc|DJ|pc|H9|pc|D9|pg||pc|C2|pc|C3|pc|CK|pc|C4|pg||mc|11|

  note that there are two '|' after each 'pg'.

  ---

Complete example:

pn
$\mathfrak{\color{cyan}{|}}$
krysieq,uijallen,ElMacaroni,Player1771
$\mathfrak{\color{cyan}{|}}$
st
$\mathfrak{\color{red}{||}}$
md
$\mathfrak{\color{cyan}{|}}$
3S865HAK9DKT3CJ862,SAQ3HQ8D9652CA753,
SKT4HJT76532DACKT,
$\mathfrak{\color{cyan}{|}}$
rh
$\mathfrak{\color{red}{||}}$
ah
$\mathfrak{\color{cyan}{|}}$
Board 1
$\mathfrak{\color{cyan}{|}}$
sv
$\mathfrak{\color{cyan}{|}}$
o
$\mathfrak{\color{cyan}{|}}$
mb
$\mathfrak{\color{white}{|}}$
1H
$\mathfrak{\color{white}{|}}$
mb|p|mb|2N!|an|inv+fit|mb|p|mb|4H|mb|p|mb|p|mb|p
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
DQ
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D3
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D2
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
DA
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
H2
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
H4
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
HA
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
H8
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
DK
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D5
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
S4
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D4
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
DT
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D6
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
HT
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D7
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
H3
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D8
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
HK
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
HQ
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
S5
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
SA
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
ST
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
S2
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
S3
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
SK
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
S7
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
S6
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
H5
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
DJ
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
H9
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
D9
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
pc
$\mathfrak{\color{cyan}{|}}$
C2
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
C3
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
CK
$\mathfrak{\color{cyan}{|}}$
pc
$\mathfrak{\color{cyan}{|}}$
C4
$\mathfrak{\color{cyan}{|}}$
pg
$\mathfrak{\color{cyan}{||}}$
mc
$\mathfrak{\color{cyan}{|}}$
11
$\mathfrak{\color{cyan}{|}}$


