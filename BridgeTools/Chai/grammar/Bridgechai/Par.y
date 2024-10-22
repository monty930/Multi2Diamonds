-- -*- haskell -*- File generated by the BNF Converter (bnfc 2.9.4.1).

-- Parser definition for use with Happy
{
{-# OPTIONS_GHC -fno-warn-incomplete-patterns -fno-warn-overlapping-patterns #-}
{-# LANGUAGE PatternSynonyms #-}

module Bridgechai.Par
  ( happyError
  , myLexer
  , pProg
  ) where

import Prelude

import qualified Bridgechai.Abs
import Bridgechai.Lex

}

%name pProg_internal Prog
-- no lexer declaration
%monad { Err } { (>>=) } { return }
%tokentype {Token}
%token
  '!'         { PT _ (TS _ 1)  }
  '!='        { PT _ (TS _ 2)  }
  '('         { PT _ (TS _ 3)  }
  ')'         { PT _ (TS _ 4)  }
  '+'         { PT _ (TS _ 5)  }
  ','         { PT _ (TS _ 6)  }
  '.'         { PT _ (TS _ 7)  }
  ':'         { PT _ (TS _ 8)  }
  ';'         { PT _ (TS _ 9)  }
  '<'         { PT _ (TS _ 10) }
  '<='        { PT _ (TS _ 11) }
  '='         { PT _ (TS _ 12) }
  '=='        { PT _ (TS _ 13) }
  '>'         { PT _ (TS _ 14) }
  '>='        { PT _ (TS _ 15) }
  'E'         { PT _ (TS _ 16) }
  'N'         { PT _ (TS _ 17) }
  'S'         { PT _ (TS _ 18) }
  'W'         { PT _ (TS _ 19) }
  '['         { PT _ (TS _ 20) }
  '[2]'       { PT _ (TS _ 21) }
  '[3]'       { PT _ (TS _ 22) }
  '[4]'       { PT _ (TS _ 23) }
  '[5]'       { PT _ (TS _ 24) }
  '[6]'       { PT _ (TS _ 25) }
  '[7]'       { PT _ (TS _ 26) }
  '[8]'       { PT _ (TS _ 27) }
  '[9]'       { PT _ (TS _ 28) }
  '[A]'       { PT _ (TS _ 29) }
  '[J]'       { PT _ (TS _ 30) }
  '[K]'       { PT _ (TS _ 31) }
  '[Q]'       { PT _ (TS _ 32) }
  '[T]'       { PT _ (TS _ 33) }
  ']'         { PT _ (TS _ 34) }
  'and'       { PT _ (TS _ 35) }
  'c'         { PT _ (TS _ 36) }
  'd'         { PT _ (TS _ 37) }
  'evaluator' { PT _ (TS _ 38) }
  'false'     { PT _ (TS _ 39) }
  'final'     { PT _ (TS _ 40) }
  'h'         { PT _ (TS _ 41) }
  'holding('  { PT _ (TS _ 42) }
  'int'       { PT _ (TS _ 43) }
  'length'    { PT _ (TS _ 44) }
  'not'       { PT _ (TS _ 45) }
  'or'        { PT _ (TS _ 46) }
  'predeal'   { PT _ (TS _ 47) }
  's'         { PT _ (TS _ 48) }
  'true'      { PT _ (TS _ 49) }
  '{'         { PT _ (TS _ 50) }
  '}'         { PT _ (TS _ 51) }
  L_Ident     { PT _ (TV _)    }
  L_integ     { PT _ (TI _)    }
  L_quoted    { PT _ (TL _)    }

%%

Ident :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Ident) }
Ident  : L_Ident { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Ident (tokenText $1)) }

Integer :: { (Bridgechai.Abs.BNFC'Position, Integer) }
Integer  : L_integ  { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), (read (tokenText $1)) :: Integer) }

String  :: { (Bridgechai.Abs.BNFC'Position, String) }
String   : L_quoted { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), ((\(PT _ (TL s)) -> s) $1)) }

Prog :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Prog) }
Prog
  : ListTopDef { (fst $1, Bridgechai.Abs.Program (fst $1) (snd $1)) }

TopDef :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.TopDef) }
TopDef
  : 'predeal' '=' '{' ListHandPredeal '}' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.TopDefPredeal (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $4)) }
  | 'final' '=' Expr { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Final (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $3)) }
  | ShapeDef { (fst $1, Bridgechai.Abs.TopDefShape (fst $1) (snd $1)) }
  | Ident '=' 'evaluator' '(' ListEvalVal ')' { (fst $1, Bridgechai.Abs.TopDefEval (fst $1) (snd $1) (snd $5)) }
  | Ident '=' 'holding(' HoldingExpr ')' { (fst $1, Bridgechai.Abs.TopDefHold (fst $1) (snd $1) (snd $4)) }

ListTopDef :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.TopDef]) }
ListTopDef
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | TopDef { (fst $1, (:[]) (snd $1)) }
  | TopDef ';' ListTopDef { (fst $1, (:) (snd $1) (snd $3)) }

ListHandPredeal :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.HandPredeal]) }
ListHandPredeal
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | HandPredeal { (fst $1, (:[]) (snd $1)) }
  | HandPredeal ',' ListHandPredeal { (fst $1, (:) (snd $1) (snd $3)) }

HandPredeal :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HandPredeal) }
HandPredeal
  : Hand ':' HandFeature { (fst $1, Bridgechai.Abs.HandPredeal (fst $1) (snd $1) (snd $3)) }

HandFeature :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HandFeature) }
HandFeature
  : String { (fst $1, Bridgechai.Abs.HandLit (fst $1) (snd $1)) }
  | '(' Ident ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SmartStackShape (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }
  | '(' Ident ',' Ident ',' Integer ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SmartStackFunc (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2) (snd $4) (snd $6)) }
  | '(' Ident ',' Ident ',' Value ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SmartStackFull (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2) (snd $4) (snd $6)) }

Value :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Value) }
Value
  : '(' Integer ',' Integer ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.ValueRange (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2) (snd $4)) }

ShapeDef :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeDef) }
ShapeDef
  : Ident '=' '(' ShapeExpr ')' { (fst $1, Bridgechai.Abs.ShapeCond (fst $1) (snd $1) (snd $4)) }
  | Ident '=' ListShape { (fst $1, Bridgechai.Abs.ShapeLit (fst $1) (snd $1) (snd $3)) }

EvalVal :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.EvalVal) }
EvalVal
  : Integer { (fst $1, Bridgechai.Abs.EvalVal (fst $1) (snd $1)) }

ListEvalVal :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.EvalVal]) }
ListEvalVal
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | EvalVal { (fst $1, (:[]) (snd $1)) }
  | EvalVal ',' ListEvalVal { (fst $1, (:) (snd $1) (snd $3)) }

Shape :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Shape) }
Shape
  : ShapeOk { (fst $1, Bridgechai.Abs.ShapeOk (fst $1) (snd $1)) }
  | ShapeNeg { (fst $1, Bridgechai.Abs.ShapeNeg (fst $1) (snd $1)) }

ShapeOk :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeOk) }
ShapeOk
  : '[' ListSuitCount ']' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.OneShapeOk (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }

ShapeNeg :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeNeg) }
ShapeNeg
  : '!' ShapeOk { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.OneShapeNeg (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }

ListShape :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.Shape]) }
ListShape
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | Shape { (fst $1, (:[]) (snd $1)) }
  | Shape '+' ListShape { (fst $1, (:) (snd $1) (snd $3)) }

SuitCount :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.SuitCount) }
SuitCount
  : SuitInt { (fst $1, Bridgechai.Abs.SuitIntCount (fst $1) (snd $1)) }
  | '(' ListSuitInt ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SuitChoice (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }

SuitInt :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.SuitInt) }
SuitInt
  : Integer { (fst $1, Bridgechai.Abs.SuitInt (fst $1) (snd $1)) }

ListSuitCount :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.SuitCount]) }
ListSuitCount
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | SuitCount { (fst $1, (:[]) (snd $1)) }
  | SuitCount ';' ListSuitCount { (fst $1, (:) (snd $1) (snd $3)) }

ListSuitInt :: { (Bridgechai.Abs.BNFC'Position, [Bridgechai.Abs.SuitInt]) }
ListSuitInt
  : {- empty -} { (Bridgechai.Abs.BNFC'NoPosition, []) }
  | SuitInt { (fst $1, (:[]) (snd $1)) }
  | SuitInt ';' ListSuitInt { (fst $1, (:) (snd $1) (snd $3)) }

Type :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Type) }
Type
  : 'int' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Int (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }

Expr6 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr6
  : Hand '.' Ident { (fst $1, Bridgechai.Abs.HandAttr (fst $1) (snd $1) (snd $3)) }
  | Integer { (fst $1, Bridgechai.Abs.ELitInt (fst $1) (snd $1)) }
  | 'true' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.ELitTrue (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'false' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.ELitFalse (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '(' Expr ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), (snd $2)) }

Expr5 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr5
  : 'not' Expr6 { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.ENot (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }
  | Expr6 { (fst $1, (snd $1)) }

Expr2 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr2
  : Expr2 RelOp Expr3 { (fst $1, Bridgechai.Abs.ERel (fst $1) (snd $1) (snd $2) (snd $3)) }
  | Expr3 { (fst $1, (snd $1)) }

Expr1 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr1
  : Expr2 'and' Expr1 { (fst $1, Bridgechai.Abs.EAnd (fst $1) (snd $1) (snd $3)) }
  | Expr2 { (fst $1, (snd $1)) }

Expr :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr
  : Expr1 'or' Expr { (fst $1, Bridgechai.Abs.EOr (fst $1) (snd $1) (snd $3)) }
  | Expr1 { (fst $1, (snd $1)) }

Expr3 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr3 : Expr4 { (fst $1, (snd $1)) }

Expr4 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Expr) }
Expr4 : Expr5 { (fst $1, (snd $1)) }

Hand :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Hand) }
Hand
  : 'N' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HandN (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'E' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HandE (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'W' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HandW (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'S' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HandS (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }

ShapeExpr6 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr6
  : SuitLit { (fst $1, Bridgechai.Abs.ESuit (fst $1) (snd $1)) }
  | Integer { (fst $1, Bridgechai.Abs.EShapeInt (fst $1) (snd $1)) }
  | '(' ShapeExpr ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), (snd $2)) }

ShapeExpr5 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr5
  : 'not' ShapeExpr6 { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.ENotShape (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }
  | ShapeExpr6 { (fst $1, (snd $1)) }

ShapeExpr2 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr2
  : ShapeExpr2 RelOp ShapeExpr3 { (fst $1, Bridgechai.Abs.ERelShape (fst $1) (snd $1) (snd $2) (snd $3)) }
  | ShapeExpr3 { (fst $1, (snd $1)) }

ShapeExpr1 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr1
  : ShapeExpr2 'and' ShapeExpr1 { (fst $1, Bridgechai.Abs.EAndShape (fst $1) (snd $1) (snd $3)) }
  | ShapeExpr2 { (fst $1, (snd $1)) }

ShapeExpr :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr
  : ShapeExpr1 'or' ShapeExpr { (fst $1, Bridgechai.Abs.EOrShape (fst $1) (snd $1) (snd $3)) }
  | ShapeExpr1 { (fst $1, (snd $1)) }

ShapeExpr3 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr3 : ShapeExpr4 { (fst $1, (snd $1)) }

ShapeExpr4 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.ShapeExpr) }
ShapeExpr4 : ShapeExpr5 { (fst $1, (snd $1)) }

SuitLit :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.SuitLit) }
SuitLit
  : 's' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SuitLitS (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'h' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SuitLitH (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'd' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SuitLitD (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | 'c' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.SuitLitC (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }

HoldingExpr5 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr5
  : 'length' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HExprLen (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | Integer { (fst $1, Bridgechai.Abs.HExprInt (fst $1) (snd $1)) }
  | Card { (fst $1, Bridgechai.Abs.HExprCard (fst $1) (snd $1)) }
  | '(' HoldingExpr ')' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), (snd $2)) }

HoldingExpr4 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr4
  : 'not' HoldingExpr5 { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.HNotExpr (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1)) (snd $2)) }
  | HoldingExpr5 { (fst $1, (snd $1)) }

HoldingExpr2 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr2
  : HoldingExpr2 RelOp HoldingExpr3 { (fst $1, Bridgechai.Abs.HRelExpr (fst $1) (snd $1) (snd $2) (snd $3)) }
  | HoldingExpr3 { (fst $1, (snd $1)) }

HoldingExpr1 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr1
  : HoldingExpr2 'and' HoldingExpr1 { (fst $1, Bridgechai.Abs.HAndExpr (fst $1) (snd $1) (snd $3)) }
  | HoldingExpr2 { (fst $1, (snd $1)) }

HoldingExpr :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr
  : HoldingExpr1 'or' HoldingExpr { (fst $1, Bridgechai.Abs.HOrExpr (fst $1) (snd $1) (snd $3)) }
  | HoldingExpr1 { (fst $1, (snd $1)) }

HoldingExpr3 :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.HoldingExpr) }
HoldingExpr3 : HoldingExpr4 { (fst $1, (snd $1)) }

Card :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.Card) }
Card
  : '[A]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.CardA (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[K]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.CardK (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[Q]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.CardQ (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[J]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.CardJ (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[T]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.CardT (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[9]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card9 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[8]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card8 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[7]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card7 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[6]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card6 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[5]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card5 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[4]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card4 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[3]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card3 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '[2]' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.Card2 (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }

RelOp :: { (Bridgechai.Abs.BNFC'Position, Bridgechai.Abs.RelOp) }
RelOp
  : '<' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.LTH (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '<=' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.LE (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '>' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.GTH (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '>=' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.GE (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '==' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.EQU (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }
  | '!=' { (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1), Bridgechai.Abs.NE (uncurry Bridgechai.Abs.BNFC'Position (tokenLineCol $1))) }

{

type Err = Either String

happyError :: [Token] -> Err a
happyError ts = Left $
  "syntax error at " ++ tokenPos ts ++
  case ts of
    []      -> []
    [Err _] -> " due to lexer error"
    t:_     -> " before `" ++ (prToken t) ++ "'"

myLexer :: String -> [Token]
myLexer = tokens

-- Entrypoints

pProg :: [Token] -> Err Bridgechai.Abs.Prog
pProg = fmap snd . pProg_internal
}

