from redeal import *

GamblingShape = Shape.from_cond(lambda s, h, d, c: ((s <= 3) and ((h <= 3) and (((d >= 7) and (c <= 4)) or ((d <= 4) and (c >= 7))))))
def gambling(holding):
	 return((((len(holding) >= 7) and ((A in holding) and ((K in holding) and (Q in holding)))) or ((len(holding) <= 4) and ((not (A in holding)) and (not (K in holding))))))

predeal = {"S": "AK K52 98765 962","N": SmartStack(GamblingShape,gambling, [4])}
def accept(deal):
	return True
