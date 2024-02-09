-- File generated by the BNF Converter (bnfc 2.9.4.1).

{-# LANGUAGE CPP #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE LambdaCase #-}
#if __GLASGOW_HASKELL__ <= 708
{-# LANGUAGE OverlappingInstances #-}
#endif

-- | Pretty-printer for 

module Print where

import Prelude
  ( ($), (.)
  , Bool(..), (==), (<)
  , Int, Integer, Double, (+), (-), (*)
  , String, (++)
  , ShowS, showChar, showString
  , all, elem, foldr, id, map, null, replicate, shows, span
  )
import Data.Char ( Char, isSpace )
import qualified Abs

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

instance Print Abs.Ident where
  prt _ (Abs.Ident i) = doc $ showString i
instance Print Abs.Prog where
  prt i = \case
    Abs.EmptyProg defs -> prPrec i 0 (concatD [prt 0 defs])
    Abs.Program defs expr -> prPrec i 0 (concatD [prt 0 defs, prt 0 expr])

instance Print Abs.Def where
  prt i = \case
    Abs.TopDefShape shapedef -> prPrec i 0 (concatD [prt 0 shapedef])
    Abs.TopDefEval evaldef -> prPrec i 0 (concatD [prt 0 evaldef])

instance Print [Abs.Def] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print Abs.Type where
  prt i = \case
    Abs.Int -> prPrec i 0 (concatD [doc (showString "int")])

instance Print Abs.ShapeDef where
  prt i = \case
    Abs.ShapeDef id_ shapeexpr -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), prt 0 shapeexpr])

instance Print Abs.EvalDef where
  prt i = \case
    Abs.EvalDef id_ evalvals -> prPrec i 0 (concatD [prt 0 id_, doc (showString "="), doc (showString "Evaluator"), doc (showString "("), prt 0 evalvals, doc (showString ")")])

instance Print Abs.EvalVal where
  prt i = \case
    Abs.EvalVal n -> prPrec i 0 (concatD [prt 0 n])

instance Print [Abs.EvalVal] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ","), prt 0 xs]

instance Print Abs.Shape where
  prt i = \case
    Abs.ShapeOk shapeok -> prPrec i 0 (concatD [prt 0 shapeok])
    Abs.ShapeNeg shapeneg -> prPrec i 0 (concatD [prt 0 shapeneg])

instance Print Abs.ShapeOk where
  prt i = \case
    Abs.OneShapeOk suitcounts -> prPrec i 0 (concatD [doc (showString "["), prt 0 suitcounts, doc (showString "]")])

instance Print Abs.ShapeNeg where
  prt i = \case
    Abs.OneShapeNeg shapeok -> prPrec i 0 (concatD [doc (showString "!"), prt 0 shapeok])

instance Print Abs.SuitInt where
  prt i = \case
    Abs.SuitInt n -> prPrec i 0 (concatD [prt 0 n])

instance Print Abs.SuitCount where
  prt i = \case
    Abs.SuitIntCount suitint -> prPrec i 0 (concatD [prt 0 suitint])
    Abs.SuitChoice suitints -> prPrec i 0 (concatD [doc (showString "("), prt 0 suitints, doc (showString ")")])

instance Print [Abs.SuitCount] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print [Abs.SuitInt] where
  prt _ [] = concatD []
  prt _ [x] = concatD [prt 0 x]
  prt _ (x:xs) = concatD [prt 0 x, doc (showString ";"), prt 0 xs]

instance Print Abs.ShapeExpr where
  prt i = \case
    Abs.ShapeSingleExpr shape -> prPrec i 0 (concatD [prt 0 shape])
    Abs.ShapeSum shapeexpr1 shapeexpr2 -> prPrec i 0 (concatD [prt 0 shapeexpr1, doc (showString "+"), prt 0 shapeexpr2])

instance Print Abs.Expr where
  prt i = \case
    Abs.HandAttr hand attr -> prPrec i 6 (concatD [prt 0 hand, doc (showString "."), prt 0 attr])
    Abs.ELitInt n -> prPrec i 6 (concatD [prt 0 n])
    Abs.ELitTrue -> prPrec i 6 (concatD [doc (showString "true")])
    Abs.ELitFalse -> prPrec i 6 (concatD [doc (showString "false")])
    Abs.Not expr -> prPrec i 5 (concatD [doc (showString "not"), prt 6 expr])
    Abs.ERel expr1 relop expr2 -> prPrec i 2 (concatD [prt 2 expr1, prt 0 relop, prt 3 expr2])
    Abs.EAnd expr1 expr2 -> prPrec i 1 (concatD [prt 2 expr1, doc (showString "and"), prt 1 expr2])
    Abs.EOr expr1 expr2 -> prPrec i 0 (concatD [prt 1 expr1, doc (showString "or"), prt 0 expr2])

instance Print Abs.Hand where
  prt i = \case
    Abs.HandN -> prPrec i 0 (concatD [doc (showString "N")])
    Abs.HandE -> prPrec i 0 (concatD [doc (showString "E")])
    Abs.HandW -> prPrec i 0 (concatD [doc (showString "W")])
    Abs.HandS -> prPrec i 0 (concatD [doc (showString "S")])

instance Print Abs.LenAttr where
  prt i = \case
    Abs.AttrSpades -> prPrec i 0 (concatD [doc (showString "spades")])
    Abs.AttrHearts -> prPrec i 0 (concatD [doc (showString "hearts")])
    Abs.AttrDiams -> prPrec i 0 (concatD [doc (showString "diams")])
    Abs.AttrClubs -> prPrec i 0 (concatD [doc (showString "clubs")])

instance Print Abs.SimpAttr where
  prt i = \case
    Abs.AttrHcp -> prPrec i 0 (concatD [doc (showString "hcp")])

instance Print Abs.VarAttr where
  prt i = \case
    Abs.AttrVar id_ -> prPrec i 0 (concatD [prt 0 id_])

instance Print Abs.Attr where
  prt i = \case
    Abs.LenAttr lenattr -> prPrec i 0 (concatD [prt 0 lenattr])
    Abs.SimpAttr simpattr -> prPrec i 0 (concatD [prt 0 simpattr])
    Abs.VarAttr varattr -> prPrec i 0 (concatD [prt 0 varattr])

instance Print Abs.RelOp where
  prt i = \case
    Abs.LTH -> prPrec i 0 (concatD [doc (showString "<")])
    Abs.LE -> prPrec i 0 (concatD [doc (showString "<=")])
    Abs.GTH -> prPrec i 0 (concatD [doc (showString ">")])
    Abs.GE -> prPrec i 0 (concatD [doc (showString ">=")])
    Abs.EQU -> prPrec i 0 (concatD [doc (showString "==")])
    Abs.NE -> prPrec i 0 (concatD [doc (showString "!=")])
