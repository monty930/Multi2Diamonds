-- File generated by the BNF Converter (bnfc 2.9.4.1).

{-# LANGUAGE CPP #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE LambdaCase #-}
#if __GLASGOW_HASKELL__ <= 708
{-# LANGUAGE OverlappingInstances #-}
#endif

-- | Pretty-printer for Bridgechai.

module Bridgechai.Print where

import Prelude
  ( ($), (.)
  , Bool(..), (==), (<)
  , Int, Integer, Double, (+), (-), (*)
  , String, (++)
  , ShowS, showChar, showString
  , all, elem, foldr, id, map, null, replicate, shows, span
  )
import Data.Char ( Char, isSpace )
import qualified Bridgechai.Abs

-- | The top-level printing method.

printTree :: Print a => a -> String
printTree = render . prt 0

type Doc = [ShowS] -> [ShowS]

doc :: ShowS -> Doc
doc = (:)

render :: Doc -> String
render d = rend 0 False (map ($ "") $ d []) ""
  where
  rend
    :: Int        -- ^ Indentation level.
    -> Bool       -- ^ Pending indentation to be output before next character?
    -> [String]
    -> ShowS
  rend i p = \case
      "["      :ts -> char '[' . rend i False ts
      "("      :ts -> char '(' . rend i False ts
      "{"      :ts -> onNewLine i     p . showChar   '{'  . new (i+1) ts
      "}" : ";":ts -> onNewLine (i-1) p . showString "};" . new (i-1) ts
      "}"      :ts -> onNewLine (i-1) p . showChar   '}'  . new (i-1) ts
      [";"]        -> char ';'
      ";"      :ts -> char ';' . new i ts
      t  : ts@(s:_) | closingOrPunctuation s
                   -> pending . showString t . rend i False ts
      t        :ts -> pending . space t      . rend i False ts
      []           -> id
    where
    -- Output character after pending indentation.
    char :: Char -> ShowS
    char c = pending . showChar c

    -- Output pending indentation.
    pending :: ShowS
    pending = if p then indent i else id

  -- Indentation (spaces) for given indentation level.
  indent :: Int -> ShowS
  indent i = replicateS (2*i) (showChar ' ')

  -- Continue rendering in new line with new indentation.
  new :: Int -> [String] -> ShowS
  new j ts = showChar '\n' . rend j True ts

  -- Make sure we are on a fresh line.
  onNewLine :: Int -> Bool -> ShowS
  onNewLine i p = (if p then id else showChar '\n') . indent i

  -- Separate given string from following text by a space (if needed).
  space :: String -> ShowS
  space t s =
    case (all isSpace t', null spc, null rest) of
      (True , _   , True ) -> []              -- remove trailing space
      (False, _   , True ) -> t'              -- remove trailing space
      (False, True, False) -> t' ++ ' ' : s   -- add space if none
      _                    -> t' ++ s
    where
      t'          = showString t []
      (spc, rest) = span isSpace s

  closingOrPunctuation :: String -> Bool
  closingOrPunctuation [c] = c `elem` closerOrPunct
  closingOrPunctuation _   = False

  closerOrPunct :: String
  closerOrPunct = ")],;"

parenth :: Doc -> Doc
parenth ss = doc (showChar '(') . ss . doc (showChar ')')

concatS :: [ShowS] -> ShowS
concatS = foldr (.) id

concatD :: [Doc] -> Doc
concatD = foldr (.) id

replicateS :: Int -> ShowS -> ShowS
replicateS n f = concatS (replicate n f)

-- | The printer class does the job.

class Print a where
  prt :: Int -> a -> Doc

instance {-# OVERLAPPABLE #-} Print a => Print [a] where
  prt i = concatD . map (prt i)

instance Print Char where
  prt _ c = doc (showChar '\'' . mkEsc '\'' c . showChar '\'')

instance Print String where
  prt _ = printString

printString :: String -> Doc
printString s = doc (showChar '"' . concatS (map (mkEsc '"') s) . showChar '"')

mkEsc :: Char -> Char -> ShowS
mkEsc q = \case
  s | s == q -> showChar '\\' . showChar s
  '\\' -> showString "\\\\"
  '\n' -> showString "\\n"
  '\t' -> showString "\\t"
  s -> showChar s

prPrec :: Int -> Int -> Doc -> Doc
prPrec i j = if j < i then parenth else id

instance Print Integer where
  prt _ x = doc (shows x)

instance Print Double where
  prt _ x = doc (shows x)

instance Print Bridgechai.Abs.Ident where
  prt _ (Bridgechai.Abs.Ident i) = doc $ showString i
instance Print Bridgechai.Abs.Prog where
  prt i = \case
    Bridgechai.Abs.Program topdefs -> prPrec i 0 (concatD [prt 0 topdefs])

instance Print Bridgechai.Abs.TopDef where
  prt i = \case
    Bridgechai.Abs.TopDefPredeal handpredeals -> prPrec i 0 (concatD [doc (showString "predeal"), doc (showString "="), doc (showString "{"), prt 0 handpredeals, doc (showString "}")])
    Bridgechai.Abs.Final expr -> prPrec i 0 (concatD [doc (showString "final"), doc (showString "="), prt 0 expr])
    Bridgechai.Abs.TopDefShape shapedef -> prPrec i 0 (concatD [prt 0 shapedef])
    Bridgechai.Abs.TopDefEval id_ evalvals -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), doc (showString "evaluator"), doc (showString "("), prt 0 evalvals, doc (showString ")")])
    Bridgechai.Abs.TopDefBool id_ holdingexpr -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), doc (showString "("), prt 0 holdingexpr, doc (showString ")")])

instance Print [Bridgechai.Abs.TopDef] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print [Bridgechai.Abs.HandPredeal] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ","), prt 0 xs]

instance Print Bridgechai.Abs.HandPredeal where
  prt i = \case
    Bridgechai.Abs.HandPredeal hand handfeature -> prPrec i 0 (concatD [prt 0 hand, doc (showString ":"), prt 0 handfeature])

instance Print Bridgechai.Abs.HandFeature where
  prt i = \case
    Bridgechai.Abs.HandLit str -> prPrec i 0 (concatD [printString str])
    Bridgechai.Abs.SmartStackShape id_ -> prPrec i 0 (concatD [doc (showString "("), prt 0 id_, doc (showString ")")])
    Bridgechai.Abs.SmartStackFunc id_1 id_2 n -> prPrec i 0 (concatD [doc (showString "("), prt 0 id_1, doc (showString ","), prt 0 id_2, doc (showString ","), prt 0 n, doc (showString ")")])
    Bridgechai.Abs.SmartStackFull id_1 id_2 value -> prPrec i 0 (concatD [doc (showString "("), prt 0 id_1, doc (showString ","), prt 0 id_2, doc (showString ","), prt 0 value, doc (showString ")")])

instance Print Bridgechai.Abs.Value where
  prt i = \case
    Bridgechai.Abs.ValueRange n1 n2 -> prPrec i 0 (concatD [doc (showString "("), prt 0 n1, doc (showString ","), prt 0 n2, doc (showString ")")])

instance Print Bridgechai.Abs.ShapeDef where
  prt i = \case
    Bridgechai.Abs.ShapeCond id_ shapeexpr -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), doc (showString "("), prt 0 shapeexpr, doc (showString ")")])
    Bridgechai.Abs.ShapeLit id_ shapes -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), prt 0 shapes])

instance Print Bridgechai.Abs.EvalVal where
  prt i = \case
    Bridgechai.Abs.EvalVal n -> prPrec i 0 (concatD [prt 0 n])

instance Print [Bridgechai.Abs.EvalVal] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ","), prt 0 xs]

instance Print Bridgechai.Abs.Shape where
  prt i = \case
    Bridgechai.Abs.ShapeOk shapeok -> prPrec i 0 (concatD [prt 0 shapeok])
    Bridgechai.Abs.ShapeNeg shapeneg -> prPrec i 0 (concatD [prt 0 shapeneg])

instance Print Bridgechai.Abs.ShapeOk where
  prt i = \case
    Bridgechai.Abs.OneShapeOk suitcounts -> prPrec i 0 (concatD [doc (showString "["), prt 0 suitcounts, doc (showString "]")])

instance Print Bridgechai.Abs.ShapeNeg where
  prt i = \case
    Bridgechai.Abs.OneShapeNeg shapeok -> prPrec i 0 (concatD [doc (showString "!"), prt 0 shapeok])

instance Print [Bridgechai.Abs.Shape] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString "+"), prt 0 xs]

instance Print Bridgechai.Abs.SuitCount where
  prt i = \case
    Bridgechai.Abs.SuitIntCount suitint -> prPrec i 0 (concatD [prt 0 suitint])
    Bridgechai.Abs.SuitChoice suitints -> prPrec i 0 (concatD [doc (showString "("), prt 0 suitints, doc (showString ")")])

instance Print Bridgechai.Abs.SuitInt where
  prt i = \case
    Bridgechai.Abs.SuitInt n -> prPrec i 0 (concatD [prt 0 n])

instance Print [Bridgechai.Abs.SuitCount] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print [Bridgechai.Abs.SuitInt] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print Bridgechai.Abs.Type where
  prt i = \case
    Bridgechai.Abs.Int -> prPrec i 0 (concatD [doc (showString "int")])

instance Print Bridgechai.Abs.Expr where
  prt i = \case
    Bridgechai.Abs.HandAttr hand id_ -> prPrec i 6 (concatD [prt 0 hand, doc (showString "."), prt 0 id_])
    Bridgechai.Abs.ELitInt n -> prPrec i 6 (concatD [prt 0 n])
    Bridgechai.Abs.ELitTrue -> prPrec i 6 (concatD [doc (showString "true")])
    Bridgechai.Abs.ELitFalse -> prPrec i 6 (concatD [doc (showString "false")])
    Bridgechai.Abs.ENot expr -> prPrec i 5 (concatD [doc (showString "not"), prt 6 expr])
    Bridgechai.Abs.ERel expr1 relop expr2 -> prPrec i 2 (concatD [prt 2 expr1, prt 0 relop, prt 3 expr2])
    Bridgechai.Abs.EAnd expr1 expr2 -> prPrec i 1 (concatD [prt 2 expr1, doc (showString "and"), prt 1 expr2])
    Bridgechai.Abs.EOr expr1 expr2 -> prPrec i 0 (concatD [prt 1 expr1, doc (showString "or"), prt 0 expr2])

instance Print Bridgechai.Abs.Hand where
  prt i = \case
    Bridgechai.Abs.HandN -> prPrec i 0 (concatD [doc (showString "N")])
    Bridgechai.Abs.HandE -> prPrec i 0 (concatD [doc (showString "E")])
    Bridgechai.Abs.HandW -> prPrec i 0 (concatD [doc (showString "W")])
    Bridgechai.Abs.HandS -> prPrec i 0 (concatD [doc (showString "S")])

instance Print Bridgechai.Abs.ShapeExpr where
  prt i = \case
    Bridgechai.Abs.ESuit suitlit -> prPrec i 6 (concatD [prt 0 suitlit])
    Bridgechai.Abs.EShapeInt n -> prPrec i 6 (concatD [prt 0 n])
    Bridgechai.Abs.ENotShape shapeexpr -> prPrec i 5 (concatD [doc (showString "not"), prt 6 shapeexpr])
    Bridgechai.Abs.ERelShape shapeexpr1 relop shapeexpr2 -> prPrec i 2 (concatD [prt 2 shapeexpr1, prt 0 relop, prt 3 shapeexpr2])
    Bridgechai.Abs.EAndShape shapeexpr1 shapeexpr2 -> prPrec i 1 (concatD [prt 2 shapeexpr1, doc (showString "and"), prt 1 shapeexpr2])
    Bridgechai.Abs.EOrShape shapeexpr1 shapeexpr2 -> prPrec i 0 (concatD [prt 1 shapeexpr1, doc (showString "or"), prt 0 shapeexpr2])

instance Print Bridgechai.Abs.SuitLit where
  prt i = \case
    Bridgechai.Abs.SuitLitS -> prPrec i 0 (concatD [doc (showString "s")])
    Bridgechai.Abs.SuitLitH -> prPrec i 0 (concatD [doc (showString "h")])
    Bridgechai.Abs.SuitLitD -> prPrec i 0 (concatD [doc (showString "d")])
    Bridgechai.Abs.SuitLitC -> prPrec i 0 (concatD [doc (showString "c")])

instance Print Bridgechai.Abs.HoldingExpr where
  prt i = \case
    Bridgechai.Abs.HExprLen -> prPrec i 5 (concatD [doc (showString "length")])
    Bridgechai.Abs.HExprInt n -> prPrec i 5 (concatD [prt 0 n])
    Bridgechai.Abs.HExprCard card -> prPrec i 5 (concatD [prt 0 card])
    Bridgechai.Abs.HNotExpr holdingexpr -> prPrec i 4 (concatD [doc (showString "not"), prt 5 holdingexpr])
    Bridgechai.Abs.HRelExpr holdingexpr1 relop holdingexpr2 -> prPrec i 2 (concatD [prt 2 holdingexpr1, prt 0 relop, prt 3 holdingexpr2])
    Bridgechai.Abs.HAndExpr holdingexpr1 holdingexpr2 -> prPrec i 1 (concatD [prt 2 holdingexpr1, doc (showString "and"), prt 1 holdingexpr2])
    Bridgechai.Abs.HOrExpr holdingexpr1 holdingexpr2 -> prPrec i 0 (concatD [prt 1 holdingexpr1, doc (showString "or"), prt 0 holdingexpr2])

instance Print Bridgechai.Abs.Card where
  prt i = \case
    Bridgechai.Abs.CardA -> prPrec i 0 (concatD [doc (showString "[A]")])
    Bridgechai.Abs.CardK -> prPrec i 0 (concatD [doc (showString "[K]")])
    Bridgechai.Abs.CardQ -> prPrec i 0 (concatD [doc (showString "[Q]")])
    Bridgechai.Abs.CardJ -> prPrec i 0 (concatD [doc (showString "[J]")])
    Bridgechai.Abs.CardT -> prPrec i 0 (concatD [doc (showString "[T]")])
    Bridgechai.Abs.Card9 -> prPrec i 0 (concatD [doc (showString "[9]")])
    Bridgechai.Abs.Card8 -> prPrec i 0 (concatD [doc (showString "[8]")])
    Bridgechai.Abs.Card7 -> prPrec i 0 (concatD [doc (showString "[7]")])
    Bridgechai.Abs.Card6 -> prPrec i 0 (concatD [doc (showString "[6]")])
    Bridgechai.Abs.Card5 -> prPrec i 0 (concatD [doc (showString "[5]")])
    Bridgechai.Abs.Card4 -> prPrec i 0 (concatD [doc (showString "[4]")])
    Bridgechai.Abs.Card3 -> prPrec i 0 (concatD [doc (showString "[3]")])
    Bridgechai.Abs.Card2 -> prPrec i 0 (concatD [doc (showString "[2]")])

instance Print Bridgechai.Abs.RelOp where
  prt i = \case
    Bridgechai.Abs.LTH -> prPrec i 0 (concatD [doc (showString "<")])
    Bridgechai.Abs.LE -> prPrec i 0 (concatD [doc (showString "<=")])
    Bridgechai.Abs.GTH -> prPrec i 0 (concatD [doc (showString ">")])
    Bridgechai.Abs.GE -> prPrec i 0 (concatD [doc (showString ">=")])
    Bridgechai.Abs.EQU -> prPrec i 0 (concatD [doc (showString "==")])
    Bridgechai.Abs.NE -> prPrec i 0 (concatD [doc (showString "!=")])
