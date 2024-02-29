pn|[player_nick_S],[player_nick_W],[player_nick_N],[player_nick_E]|st||md|[dealer][cards of S],[cards of W],[cards of N],[cards of E],|rh||ah|[nazwa boarda]|sv|[vul]|[Bid sequence]|[game record]|

---

What I stil do not know: "pn", "rh", "ah", "sv"
maybe tells if MP/IMP? All tables I've seen had those values unchanged

---

[dealer]: 1 - S, 2 - W, 3 - N, 4 - E

[cards of X] in format: S---H---D---C---

[vul]: o = none, n = NS, b = both, e = EW

----

[Bid sequence]:
mb|[bid]|mb|bid|mb...

Example:
mb|3H|mb|p|mb|4H|mb|d|mb|p|mb|4S|mb|d|mb|p|mb|p|mb|p

if bid is alerted after a bid we put: an|[alert message]
example:
mb|1H|mb|p|mb|2N!|an|inv+fit|mb|p|mb|4H|mb|p|mb|p|mb|p

----

[game record]

Next tricks divided with pg, next cards divided with pc, claim = mc and number of tricks claimed after that

pg||pc|DQ|pc|D3|pc|D2|pc|DA|pg||pc|H2|pc|H4|pc|HA|pc|H8|pg||pc|DK|pc|D5|pc|S4|pc|D4|pg||pc|DT|pc|D6|pc|HT|pc|D7|pg||pc|H3|pc|D8|pc|HK|pc|HQ|pg||pc|S5|pc|SA|pc|ST|pc|S2|pg||pc|S3|pc|SK|pc|S7|pc|S6|pg||pc|H5|pc|DJ|pc|H9|pc|D9|pg||pc|C2|pc|C3|pc|CK|pc|C4|pg||mc|11|

Complete example:
pn|krysieq,uijallen,ElMacaroni,Player1771|st||md|3S865HAK9DKT3CJ862,SAQ3HQ8D9652CA753,SKT4HJT76532DACKT,|rh||ah|Board 1|sv|o|mb|1H|mb|p|mb|2N!|an|inv+fit|mb|p|mb|4H|mb|p|mb|p|mb|p|pg||pc|DQ|pc|D3|pc|D2|pc|DA|pg||pc|H2|pc|H4|pc|HA|pc|H8|pg||pc|DK|pc|D5|pc|S4|pc|D4|pg||pc|DT|pc|D6|pc|HT|pc|D7|pg||pc|H3|pc|D8|pc|HK|pc|HQ|pg||pc|S5|pc|SA|pc|ST|pc|S2|pg||pc|S3|pc|SK|pc|S7|pc|S6|pg||pc|H5|pc|DJ|pc|H9|pc|D9|pg||pc|C2|pc|C3|pc|CK|pc|C4|pg||mc|11|