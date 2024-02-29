--  Krystyna Gasinska --
--  BridgeChai compiler 2024 --
{-# LANGUAGE FlexibleContexts #-}

module TypeChecker where

import           Abs
import           Control.Exception
import           Control.Monad
import           Control.Monad.Except
import           Control.Monad.Reader
import           Control.Monad.State
import qualified Data.ByteString.Char8 as B
import           Data.List             (nub)
import qualified Data.Map              as M
import qualified Data.Map              as Map
import           Lex                   (Token, mkPosToken, posLineCol)
import           Par
import           Print                 (Print, printTree)
import           Skel
import           System.Directory      (canonicalizePath)
import           System.Environment    (getArgs, getExecutablePath)
import           System.Exit
import           System.FilePath       (dropExtension, takeDirectory,
                                        takeFileName, (<.>), (</>))
import           System.FilePath.Posix
import           System.IO
import           System.Process

type StoreT = M.Map Ident VarType

type RSET a = StateT StoreT (ExceptT String IO) a

data VarType = Shape | Holding | Evaluator | Attr | Unique

makeTypeError :: String -> BNFC'Position -> RSET a
makeTypeError s pos = do
  case pos of
    BNFC'Position l c -> do
      liftIO $ hPutStrLn stderr ("ERROR\nType checker, line " ++ show l ++ ", column " ++ show c ++ ": " ++ s ++ ".")
      liftIO $ exitWith (ExitFailure 1)
    _ -> do
      liftIO $ hPutStrLn stderr ("ERROR\nType checker: " ++ s ++ ".")
      liftIO $ exitWith (ExitFailure 1)

typeCheck :: Prog -> IO ()
typeCheck ast = do
  let store0 = M.insert (Ident "any") Shape (M.insert (Ident "balanced") Shape M.empty)
  let store1 = M.insert (Ident "hcp") Evaluator store0
  let store3 = M.insert (Ident "spades") Attr store1
  let store4 = M.insert (Ident "hearts") Attr store3
  let store5 = M.insert (Ident "diamonds") Attr store4
  let store6 = M.insert (Ident "clubs") Attr store5
  let store7 = M.insert (Ident "losers") Attr store6
  let store8 = M.insert (Ident "freakness") Attr store7
  let store9 = M.insert (Ident "controls") Attr store8
  let store = M.insert (Ident "pt") Attr store9
  rse <- runExceptT (runStateT (checkProgram ast) store)
  return ()

checkProgram :: Prog -> RSET ()
checkProgram (Program _ topdefs) = do
  checTopDefs topdefs

checTopDefs :: [TopDef] -> RSET ()
checTopDefs [] = return ()
checTopDefs (x : xs) = do
  checkTopDef x
  checTopDefs xs

checkTopDef :: TopDef -> RSET ()
checkTopDef (TopDefPredeal (BNFC'Position l c) handpredeal) = do
  -- check if predeal is already in the store
  store <- get
  case M.lookup (Ident "predeal") store of
    Just _ -> makeTypeError ("Predeal can be defined only once. Redefinition occured at line " ++ show l) BNFC'NoPosition
    Nothing -> do
      put (M.insert (Ident "predeal") Unique store)
      checkHandPredeals handpredeal
checkTopDef (Final (BNFC'Position l c) expr) = do
  -- check if final is already in the store
  store <- get
  case M.lookup (Ident "final") store of
    Just _ -> makeTypeError ("Final can be defined only once. Redefinition occured at line " ++ show l) BNFC'NoPosition
    Nothing -> do
      put (M.insert (Ident "final") Unique store)
      checkFinalExpr expr
checkTopDef (TopDefShape _ shapedef) = do
  checkTopDefShape shapedef
checkTopDef (TopDefEval pos ident evalVals) = do
  checkTopDefEval pos ident evalVals
checkTopDef (TopDefHold pos ident expr) = do
  checkTopDefHold pos ident expr
checkTopDef _ = undefined -- intended

checkTopDefShape :: ShapeDef -> RSET ()
checkTopDefShape (ShapeCond (BNFC'Position l c) ident shape) = do
  checkForRedefinition ident l Shape
  checkShapeExpr shape
checkTopDefShape (ShapeLit (BNFC'Position l c) ident shape) = do
  checkForRedefinition ident l Shape
  checkShapes shape
checkTopDefShape _ = undefined -- intended

checkTopDefEval :: BNFC'Position -> Ident -> [EvalVal] -> RSET ()
checkTopDefEval (BNFC'Position l c) ident evalVals = do
  checkForRedefinition ident l Evaluator
  checkEvalVals (BNFC'Position l c) evalVals
checkTopDefEval _ _ _ = undefined -- intended

checkTopDefHold :: BNFC'Position -> Ident -> HoldingExpr -> RSET ()
checkTopDefHold (BNFC'Position l c) ident expr = do
  checkForRedefinition ident l Holding
  checkHoldingExpr expr
checkTopDefHold _ _ _ = undefined -- intended

checkHandPredeals :: [HandPredeal] -> RSET ()
checkHandPredeals hands =
  -- check if all hands are unique
  checkHandPredeals' hands M.empty

checkHandPredeals' :: [HandPredeal] -> M.Map Hand VarType -> RSET ()
checkHandPredeals' [] _ = return ()
checkHandPredeals' (x : xs) predealStore = do
  predealStore' <- checkHandPredeal x predealStore
  checkHandPredeals' xs predealStore'

checkHandPredeal :: HandPredeal -> M.Map Hand VarType -> RSET (M.Map Hand VarType)
checkHandPredeal (HandPredeal _ hand handFeature) predealStore = do
  -- check if hand is already in the store
  case M.lookup hand predealStore of
    Just _ -> makeTypeError ("Hand predeal " ++ handToStr hand ++ " can be defined only once.") BNFC'NoPosition
    Nothing -> do
      checkHandFeature handFeature
      return (M.insert hand Unique predealStore)

checkHandFeature :: HandFeature -> RSET ()
checkHandFeature (HandLit pos handLit) = checkHandLit pos handLit
checkHandFeature (SmartStackShape pos shape) = do
  checkIfShapeDefined shape pos
checkHandFeature (SmartStackFunc pos ident identHold val) = do
  checkIfShapeDefined ident pos
  checkIfHoldDefined identHold pos
  checkVal pos val
checkHandFeature (SmartStackFull pos ident identEv range) = do
  checkIfShapeDefined ident pos
  checkIfEvalDefined identEv pos
  checkRange range

checkHandLit :: BNFC'Position -> String -> RSET ()
checkHandLit pos handStr =
  let groups = words handStr
      validLengths = [2, 3, 5, 3]
      isValidGroup (expectedLen, group) = length group == expectedLen && all (`elem` "23456789TJQKA") group && length (nub group) == length group
   in if length groups == 4 && all isValidGroup (zip validLengths groups)
        then return ()
        else makeTypeError ("Invalid hand literal: " ++ handStr) pos

checkVal :: BNFC'Position -> Integer -> RSET ()
checkVal pos i = do
  when (i < 0 && i > 4) $ makeTypeError ("Value " ++ show i ++ " is not in the range 0-4.") pos

checkRange :: Value -> RSET ()
checkRange (ValueRange pos i j) = do
  when (i > j) $ makeTypeError "Incorrect range" pos
  when (i < 0) $ makeTypeError "Incorrect range" pos

checkIfEvalDefined :: Ident -> BNFC'Position -> RSET ()
checkIfEvalDefined ident pos = do
  store <- get
  case M.lookup ident store of
    Just Evaluator -> return ()
    Just _ -> makeTypeError (identToStr ident ++ " is not an evaluator.") pos
    Nothing -> makeTypeError ("Evaluator " ++ identToStr ident ++ " is not defined.") pos

checkIfHoldDefined :: Ident -> BNFC'Position -> RSET ()
checkIfHoldDefined ident pos = do
  store <- get
  case M.lookup ident store of
    Just Holding -> return ()
    Just _ -> makeTypeError (identToStr ident ++ " is not a holding.") pos
    Nothing -> makeTypeError ("Holding " ++ identToStr ident ++ " is not defined.") pos

checkIfShapeDefined :: Ident -> BNFC'Position -> RSET ()
checkIfShapeDefined ident pos = do
  store <- get
  case M.lookup ident store of
    Just Shape -> return ()
    Just _ -> makeTypeError (identToStr ident ++ " is not a shape.") pos
    Nothing -> makeTypeError ("Shape " ++ identToStr ident ++ " is not defined.") pos

checkFinalExpr :: Expr -> RSET ()
checkFinalExpr (HandAttr pos hand ident) = do
  store <- get
  case M.lookup ident store of
    Just Shape -> return ()
    Just Evaluator -> return ()
    Just Attr -> return ()
    Just _ -> makeTypeError "Type error" pos
    Nothing -> makeTypeError (identToStr ident ++ " is not defined.") pos

checkFinalExpr (ENot pos expr) = checkFinalExpr expr

checkFinalExpr (EAnd pos expr1 expr2) = do
  checkFinalExpr expr1
  checkFinalExpr expr2

checkFinalExpr (EOr pos expr1 expr2) = do
  checkFinalExpr expr1
  checkFinalExpr expr2

checkFinalExpr (ERel pos expr1 _ expr2) = do
  checkFinalExpr expr1
  checkFinalExpr expr2

checkFinalExpr _ = return () -- intended

-- sense of shape expression is not checked
checkShapeExpr :: ShapeExpr -> RSET ()
checkShapeExpr _ = return ()

checkShapes :: [Shape] -> RSET ()
checkShapes [] = return ()

checkShapes (x : xs) = do
  checkShape x
  checkShapes xs

checkShape :: Shape -> RSET ()
checkShape (ShapeOk _ (OneShapeOk pos suitCounts)) = do
  checkSuitCounts pos suitCounts 0 0

checkShape (ShapeNeg _ (OneShapeNeg _ (OneShapeOk pos suitCounts))) = do
  checkSuitCounts pos suitCounts 0 0

checkSuitCounts :: BNFC'Position -> [SuitCount] -> Integer -> Integer -> RSET ()
checkSuitCounts pos [] howMany sum = do
  when (howMany /= 4) $ makeTypeError "Incorrect number of suits in shape" pos
  when (sum /= 13) $ makeTypeError "Incorrect number of cards in shape" pos

checkSuitCounts pos ((SuitIntCount _ v) : xs) howMany sum = do
  let i = case v of
        SuitInt _ i -> i
  checkSuitCounts pos xs (howMany + 1) (sum + i)

checkSuitCounts pos ((SuitChoice _ suitInts) : xs) howMany sum = do
  (h, s) <- checkSuitInts pos suitInts 0 0
  if h == 0
    then makeTypeError "Incorrect number of suits in shape" pos
    else checkSuitCounts pos xs (howMany + h) (sum + s)

checkSuitInts :: BNFC'Position -> [SuitInt] -> Integer -> Integer -> RSET (Integer, Integer)
checkSuitInts pos [] howMany sum = return (howMany, sum)

checkSuitInts pos ((SuitInt _ i) : xs) howMany sum = do
  checkSuitInts pos xs (howMany + 1) (sum + i)

checkEvalVals :: BNFC'Position -> [EvalVal] -> RSET ()
checkEvalVals pos evalVals = do
    let len = length evalVals
    when (len < 1 || len > 13) $ makeTypeError "Incorrect number of values in evaluator" pos

checkEvalVals' :: BNFC'Position -> [EvalVal] -> RSET ()
checkEvalVals' pos [] = return ()

checkEvalVals' pos (x : xs) = do
  checkEvalVal pos x
  checkEvalVals' pos xs

checkEvalVal :: BNFC'Position -> EvalVal -> RSET ()
checkEvalVal pos val = do
    let i = case val of
            EvalVal _ i -> i
    when (i < 0 || i > 1000) $ makeTypeError "Incorrect value in evaluator" pos

-- sense of holding expression is not checked
checkHoldingExpr :: HoldingExpr -> RSET ()
checkHoldingExpr _ = return ()

identToStr :: Ident -> String
identToStr (Ident s) = s

checkForRedefinition :: Ident -> Int -> VarType -> RSET ()
checkForRedefinition ident l varType = do
  store <- get
  case M.lookup ident store of
    Just _ -> makeTypeError ("Redefinition of " ++ identToStr ident ++ " at line: " ++ show l) BNFC'NoPosition
    Nothing -> do
      put (M.insert ident varType store)
      return ()

handToStr :: Hand -> String
handToStr (HandE _) = "E"
handToStr (HandS _) = "S"
handToStr (HandW _) = "W"
handToStr (HandN _) = "N"
