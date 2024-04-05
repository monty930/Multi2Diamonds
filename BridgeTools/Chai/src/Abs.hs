-- File generated by the BNF Converter (bnfc 2.9.4.1).

{-# LANGUAGE DeriveTraversable #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE PatternSynonyms #-}

-- | The abstract syntax of language bridgechai.

module Abs where

import Prelude (Integer, String)
import qualified Prelude as C
  ( Eq, Ord, Show, Read
  , Functor, Foldable, Traversable
  , Int, Maybe(..)
  )
import qualified Data.String

type Prog = Prog' BNFC'Position
data Prog' a = Program a [TopDef' a]
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type TopDef = TopDef' BNFC'Position
data TopDef' a
    = TopDefPredeal a [HandPredeal' a]
    | Final a (Expr' a)
    | TopDefShape a (ShapeDef' a)
    | TopDefEval a Ident [EvalVal' a]
    | TopDefHold a Ident (HoldingExpr' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type HandPredeal = HandPredeal' BNFC'Position
data HandPredeal' a = HandPredeal a (Hand' a) (HandFeature' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type HandFeature = HandFeature' BNFC'Position
data HandFeature' a
    = HandLit a String
    | SmartStackShape a Ident
    | SmartStackFunc a Ident Ident Integer
    | SmartStackFull a Ident Ident (Value' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Value = Value' BNFC'Position
data Value' a = ValueRange a Integer Integer
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type ShapeDef = ShapeDef' BNFC'Position
data ShapeDef' a
    = ShapeCond a Ident (ShapeExpr' a) | ShapeLit a Ident [Shape' a]
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type EvalVal = EvalVal' BNFC'Position
data EvalVal' a = EvalVal a Integer
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Shape = Shape' BNFC'Position
data Shape' a = ShapeOk a (ShapeOk' a) | ShapeNeg a (ShapeNeg' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type ShapeOk = ShapeOk' BNFC'Position
data ShapeOk' a = OneShapeOk a [SuitCount' a]
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type ShapeNeg = ShapeNeg' BNFC'Position
data ShapeNeg' a = OneShapeNeg a (ShapeOk' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type SuitCount = SuitCount' BNFC'Position
data SuitCount' a
    = SuitIntCount a (SuitInt' a) | SuitChoice a [SuitInt' a]
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type SuitInt = SuitInt' BNFC'Position
data SuitInt' a = SuitInt a Integer
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Type = Type' BNFC'Position
data Type' a = Int a
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Expr = Expr' BNFC'Position
data Expr' a
    = HandAttr a (Hand' a) Ident
    | ELitInt a Integer
    | ELitTrue a
    | ELitFalse a
    | ENot a (Expr' a)
    | ERel a (Expr' a) (RelOp' a) (Expr' a)
    | EAnd a (Expr' a) (Expr' a)
    | EOr a (Expr' a) (Expr' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Hand = Hand' BNFC'Position
data Hand' a = HandN a | HandE a | HandW a | HandS a
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type ShapeExpr = ShapeExpr' BNFC'Position
data ShapeExpr' a
    = ESuit a (SuitLit' a)
    | EShapeInt a Integer
    | ENotShape a (ShapeExpr' a)
    | ERelShape a (ShapeExpr' a) (RelOp' a) (ShapeExpr' a)
    | EAndShape a (ShapeExpr' a) (ShapeExpr' a)
    | EOrShape a (ShapeExpr' a) (ShapeExpr' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type SuitLit = SuitLit' BNFC'Position
data SuitLit' a = SuitLitS a | SuitLitH a | SuitLitD a | SuitLitC a
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type HoldingExpr = HoldingExpr' BNFC'Position
data HoldingExpr' a
    = HExprLen a
    | HExprInt a Integer
    | HExprCard a (Card' a)
    | HNotExpr a (HoldingExpr' a)
    | HRelExpr a (HoldingExpr' a) (RelOp' a) (HoldingExpr' a)
    | HAndExpr a (HoldingExpr' a) (HoldingExpr' a)
    | HOrExpr a (HoldingExpr' a) (HoldingExpr' a)
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type Card = Card' BNFC'Position
data Card' a
    = CardA a
    | CardK a
    | CardQ a
    | CardJ a
    | CardT a
    | Card9 a
    | Card8 a
    | Card7 a
    | Card6 a
    | Card5 a
    | Card4 a
    | Card3 a
    | Card2 a
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

type RelOp = RelOp' BNFC'Position
data RelOp' a = LTH a | LE a | GTH a | GE a | EQU a | NE a
  deriving (C.Eq, C.Ord, C.Show, C.Read, C.Functor, C.Foldable, C.Traversable)

newtype Ident = Ident String
  deriving (C.Eq, C.Ord, C.Show, C.Read, Data.String.IsString)

-- | Start position (line, column) of something.

type BNFC'Position = C.Maybe (C.Int, C.Int)

pattern BNFC'NoPosition :: BNFC'Position
pattern BNFC'NoPosition = C.Nothing

pattern BNFC'Position :: C.Int -> C.Int -> BNFC'Position
pattern BNFC'Position line col = C.Just (line, col)

-- | Get the start position of something.

class HasPosition a where
  hasPosition :: a -> BNFC'Position

instance HasPosition Prog where
  hasPosition = \case
    Program p _ -> p

instance HasPosition TopDef where
  hasPosition = \case
    TopDefPredeal p _ -> p
    Final p _ -> p
    TopDefShape p _ -> p
    TopDefEval p _ _ -> p
    TopDefHold p _ _ -> p

instance HasPosition HandPredeal where
  hasPosition = \case
    HandPredeal p _ _ -> p

instance HasPosition HandFeature where
  hasPosition = \case
    HandLit p _ -> p
    SmartStackShape p _ -> p
    SmartStackFunc p _ _ _ -> p
    SmartStackFull p _ _ _ -> p

instance HasPosition Value where
  hasPosition = \case
    ValueRange p _ _ -> p

instance HasPosition ShapeDef where
  hasPosition = \case
    ShapeCond p _ _ -> p
    ShapeLit p _ _ -> p

instance HasPosition EvalVal where
  hasPosition = \case
    EvalVal p _ -> p

instance HasPosition Shape where
  hasPosition = \case
    ShapeOk p _ -> p
    ShapeNeg p _ -> p

instance HasPosition ShapeOk where
  hasPosition = \case
    OneShapeOk p _ -> p

instance HasPosition ShapeNeg where
  hasPosition = \case
    OneShapeNeg p _ -> p

instance HasPosition SuitCount where
  hasPosition = \case
    SuitIntCount p _ -> p
    SuitChoice p _ -> p

instance HasPosition SuitInt where
  hasPosition = \case
    SuitInt p _ -> p

instance HasPosition Type where
  hasPosition = \case
    Int p -> p

instance HasPosition Expr where
  hasPosition = \case
    HandAttr p _ _ -> p
    ELitInt p _ -> p
    ELitTrue p -> p
    ELitFalse p -> p
    ENot p _ -> p
    ERel p _ _ _ -> p
    EAnd p _ _ -> p
    EOr p _ _ -> p

instance HasPosition Hand where
  hasPosition = \case
    HandN p -> p
    HandE p -> p
    HandW p -> p
    HandS p -> p

instance HasPosition ShapeExpr where
  hasPosition = \case
    ESuit p _ -> p
    EShapeInt p _ -> p
    ENotShape p _ -> p
    ERelShape p _ _ _ -> p
    EAndShape p _ _ -> p
    EOrShape p _ _ -> p

instance HasPosition SuitLit where
  hasPosition = \case
    SuitLitS p -> p
    SuitLitH p -> p
    SuitLitD p -> p
    SuitLitC p -> p

instance HasPosition HoldingExpr where
  hasPosition = \case
    HExprLen p -> p
    HExprInt p _ -> p
    HExprCard p _ -> p
    HNotExpr p _ -> p
    HRelExpr p _ _ _ -> p
    HAndExpr p _ _ -> p
    HOrExpr p _ _ -> p

instance HasPosition Card where
  hasPosition = \case
    CardA p -> p
    CardK p -> p
    CardQ p -> p
    CardJ p -> p
    CardT p -> p
    Card9 p -> p
    Card8 p -> p
    Card7 p -> p
    Card6 p -> p
    Card5 p -> p
    Card4 p -> p
    Card3 p -> p
    Card2 p -> p

instance HasPosition RelOp where
  hasPosition = \case
    LTH p -> p
    LE p -> p
    GTH p -> p
    GE p -> p
    EQU p -> p
    NE p -> p

