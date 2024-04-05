from redeal import *

Roman = Shape("44(50)")

predeal = {
	"N": SmartStack(Roman, Evaluator(4, 3, 2, 1), range(2, 40))
	}