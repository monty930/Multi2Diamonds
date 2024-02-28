--  Krystyna Gasinska --
--  BridgeChai compiler 2024 --
{-# LANGUAGE FlexibleContexts #-}
module Main where

import           Abs
import           Control.Exception
import           Control.Monad
import           Control.Monad.Except
import           Control.Monad.Reader
import           Control.Monad.State
import qualified Data.ByteString.Char8 as B
import qualified Data.Map              as M
import qualified Data.Map              as Map
import           Lex       (Token, mkPosToken)
import           Par
import           Print     (Print, printTree)
import           Skel
import           System.Directory      (canonicalizePath)
import           System.Environment    (getArgs, getExecutablePath)
import           System.Exit
import           System.FilePath       (dropExtension, takeDirectory,
                                        takeFileName, takeBaseName, (<.>), (</>))
import           System.IO
import           System.Process
import           TypeChecker

type StoreVar = M.Map Ident Type

type LenAttr = [Ident]

type FeatAttr = [Ident]

type Store = (StoreVar, LenAttr, FeatAttr)

type RSE a = StateT Store (ExceptT String IO) a

type ParseFun a = [Token] -> Err a

getParsedProgramFromFile :: ParseFun Prog -> FilePath -> IO Prog
getParsedProgramFromFile p f = readFile f >>= getParsedProgram p

getParsedProgram :: ParseFun Prog -> String -> IO Prog
getParsedProgram p s =
  case p ts of
    Left err -> errorWithoutStackTrace err
    Right tree -> return tree
  where
    ts = myLexer s

main :: IO ()
main =
  -- Get the file path from the command line arguments.
  do
    args <- getArgs
    case args of
      [filePath] -> processFile filePath
      _          -> putStrLn "Usage: latte_py <input-file>"

-- Get the directory containing the currently running executable.
getExecutableDir :: IO FilePath
getExecutableDir = do
  exePath <- getExecutablePath
  canonicalizePath (takeDirectory exePath)

processFile :: FilePath -> IO ()
processFile filePath = do
  ast <- try $ getParsedProgramFromFile pProg filePath
  case ast of
    Left err -> do
      hPutStrLn stderr "ERROR\n"
      print (err :: SomeException)
      exitWith (ExitFailure 1)
    Right ast -> do
      typeCheck ast
      let directory = takeDirectory filePath
          baseName = takeBaseName filePath
      let store = (
            M.empty,
            [Ident "spades", Ident "hearts", Ident "clubs", Ident "diamonds"],
            [Ident "hcp", Ident "freakness", Ident "losers", Ident "pt", Ident "controls"])
      let env = M.empty
      let header =
            "from redeal import *\n\n"
      pythonCode <-
        runExceptT
          (runStateT (generatePythonCode ast) store)
      case pythonCode of
        Left err -> putStrLn err
        Right (pythonCode, _) -> do
          let outputPathLLVM = directory </> baseName <.> "ll"
          putStrLn $ header ++ pythonCode

generatePythonCode :: Prog -> RSE String
generatePythonCode (Program _ topdefs) = do
  evalTopDefs topdefs

evalTopDefs ((TopDefPredeal _ p) : topdefs) = do
  pCode <- evalPredeal p
  topDefsCode <- evalTopDefs topdefs
  return $ pCode ++ topDefsCode

evalTopDefs ((Final _ f) : topdefs) = do
  fCode <- evalFinal f
  topDefsCode <- evalTopDefs topdefs
  return $ fCode ++ topDefsCode

evalTopDefs ((TopDefShape _ sh) : topdefs) = do
  shCode <- evalTopShape sh
  topDefsCode <- evalTopDefs topdefs
  return $ shCode ++ topDefsCode

evalTopDefs ((TopDefEval _ id vals) : topdefs) = do
  evCode <- evalTopEv id vals
  topDefsCode <- evalTopDefs topdefs
  return $ evCode ++ topDefsCode

evalTopDefs (TopDefHold _ id expr : topdefs) = do
  exCode <- evalHoldExpr expr
  topDefsCode <- evalTopDefs topdefs
  return $ 
    "def " ++ 
    showIdent id ++ 
    "(holding):\n\t return(" ++ exCode ++ ")\n\n" ++ 
    topDefsCode

evalTopDefs [] = return "\n"

evalHoldExpr (HExprLen _) = return "len(holding)"

evalHoldExpr (HExprInt _ i) = return $ show i

evalHoldExpr (HExprCard _ c) = do
  cCode <- evalCard c
  return $ "(" ++ cCode ++ " in holding)"

evalHoldExpr (HNotExpr _ e) = do
  eCode <- evalHoldExpr e
  return $ "(not " ++ eCode ++ ")"

evalHoldExpr (HRelExpr _ e1 op e2) = do
  e1Code <- evalHoldExpr e1
  e2Code <- evalHoldExpr e2
  opCode <- evalRelOp op
  return $ "(" ++ e1Code ++ " " ++ opCode ++ " " ++ e2Code ++ ")"

evalHoldExpr (HAndExpr _ e1 e2) = do
  e1Code <- evalHoldExpr e1
  e2Code <- evalHoldExpr e2
  return $ "(" ++ e1Code ++ " and " ++ e2Code ++ ")"

evalHoldExpr (HOrExpr _ e1 e2) = do
  e1Code <- evalHoldExpr e1
  e2Code <- evalHoldExpr e2
  return $ "(" ++ e1Code ++ " or " ++ e2Code ++ ")"

evalShapeExpr (ESuit _ str) = evalSuitLit str

evalShapeExpr (EShapeInt _ i) = return $ show i

evalShapeExpr (ENotShape _ sh) = do
  shCode <- evalShapeExpr sh
  return $ "not (" ++ shCode ++ ")"

evalShapeExpr (ERelShape _ sh1 op sh2) = do
  sh1Code <- evalShapeExpr sh1
  sh2Code <- evalShapeExpr sh2
  opCode <- evalRelOp op
  return $ "(" ++ sh1Code ++ " " ++ opCode ++ " " ++ sh2Code ++ ")"

evalShapeExpr (EAndShape _ sh1 sh2) = do
  sh1Code <- evalShapeExpr sh1
  sh2Code <- evalShapeExpr sh2
  return $ "(" ++ sh1Code ++ " and " ++ sh2Code ++ ")"

evalShapeExpr (EOrShape _ sh1 sh2) = do
  sh1Code <- evalShapeExpr sh1
  sh2Code <- evalShapeExpr sh2
  return $ "(" ++ sh1Code ++ " or " ++ sh2Code ++ ")"

evalSuitLit (SuitLitC _) = return "c"
evalSuitLit (SuitLitD _) = return "d"
evalSuitLit (SuitLitH _) = return "h"
evalSuitLit (SuitLitS _) = return "s"

evalTopShape (ShapeCond _ id shE) = do
  shapesCode <- evalShapeExpr shE
  return $ showIdent id ++ " = Shape.from_cond(lambda s, h, d, c: " ++ shapesCode ++ ")\n"

evalTopShape (ShapeLit _ id shapes) = do
  shapesCode <- evalShapes shapes
  return $ showIdent id ++ " = " ++ shapesCode ++ "\n"

evalShapes shapes = do
  posCodes <- mapM evalShape $ filter isShapeOk shapes
  negCodes <- mapM evalShape $ filter isShapeNeg shapes
  let posStr = if null posCodes then "" else concatIntersperse "+" posCodes
      negStr = if null negCodes then "" else concatIntersperse "-" negCodes
      combinedStr = case (null posCodes, null negCodes) of
                      (True, True) -> error "Empty shape!"
                      (True, False) -> error "Shape must contain at least one positive."
                      (False, True) -> posStr
                      (False, False) -> posStr ++ "-" ++ negStr
  return combinedStr
  where
    concatIntersperse sep xs = case xs of
        [] -> ""
        _ -> foldr1 (\a b -> a ++ sep ++ b) xs
    isShapeOk (ShapeOk _ _) = True
    isShapeOk _ = False
    isShapeNeg (ShapeNeg _ _) = True
    isShapeNeg _ = False

evalShape :: Shape -> RSE String
evalShape (ShapeOk _ sh) = evalShapeOk sh
evalShape (ShapeNeg _ sh) = evalShapeNeg sh

evalShapeOk (OneShapeOk _ scs) = do
  scsCodes <- mapM evalSuitCount scs
  return $ "Shape(\"" ++ concat scsCodes ++ "\")"

evalShapeNeg (OneShapeNeg _ (OneShapeOk _ scs)) = do
  scsCodes <- mapM evalSuitCount scs
  return $ "Shape(\"" ++ concat scsCodes ++ "\")"


evalSuitCount :: SuitCount -> RSE String
evalSuitCount a = do
  case a of
    (SuitIntCount _ (SuitInt _ a)) -> return $ show a
    (SuitChoice _ as) -> do
      asCodes <- mapM evalSuitInt as
      return $ "(" ++ concat asCodes ++ ")"

evalSuitInt :: SuitInt -> RSE String
evalSuitInt (SuitInt _ a) = return $ show a

evalTopEv ident vals = do
  valsCode <- evalEvValsCode vals
  return $ showIdent ident ++ " = Evaluator(" ++ valsCode ++ ")\n"

evalEvValsCode :: [EvalVal] -> RSE String
evalEvValsCode [EvalVal _ val] = 
  return $ show val

evalEvValsCode ((EvalVal _ val) : vals) = do
  valsCode <- evalEvValsCode vals
  return $ show val ++ ", " ++ valsCode

evalEvValsCode [] = undefined -- intended

evalFinal expr = do
  exprCode <- evalExp expr
  return $ "\ndef accept(deal):\n\treturn " ++ exprCode ++ "\n"

evalPredeal :: [HandPredeal] -> RSE String
evalPredeal preArgs = do
  presCode <- evalOneHandPres preArgs
  return $ "predeal = {" ++ presCode ++ "}"

evalOneHandPres :: [HandPredeal] -> RSE String
evalOneHandPres [pre] = do
  evalOneHandPre pre

evalOneHandPres (pre : pres) = do
  preCode <- evalOneHandPre pre
  presCode <- evalOneHandPres pres
  return $ preCode ++ "," ++ presCode

evalOneHandPres [] = undefined -- intended

evalOneHandPre :: HandPredeal -> RSE String
evalOneHandPre (HandPredeal _ h hf) = do
  hCode <- case h of
    HandN _ -> return "N"
    HandE _ -> return "E"
    HandS _ -> return "S"
    HandW _ -> return "W"
  hfCode <- evalHandFeatureCode hf
  return $ "\"" ++ hCode ++ "\": " ++ hfCode

evalHandFeatureCode :: HandFeature -> RSE String
evalHandFeatureCode (HandLit _ str) = return $ "\"" ++ str ++ "\""

evalHandFeatureCode (SmartStackShape _ shape) = do
  return $ "SmartStack(" ++ showIdent shape ++ ", Evaluator(4,3,2,1), range(0, 40))"

evalHandFeatureCode (SmartStackFull _ shape eval val) = do
  valCode <- evalVal val
  return $ "SmartStack(" ++ showIdent shape ++ "," ++ showIdent eval ++ ", range" ++ valCode ++ ")"

evalHandFeatureCode (SmartStackFunc _ shape eval i) = do
  return $ "SmartStack(" ++ showIdent shape ++ "," ++ showIdent eval ++ ", [" ++ show i ++ "])"

evalVal (ValueRange _ int1 int2) = do
  return $ "(" ++ show int1 ++ "," ++ show int2 ++")"

evalExp :: Expr -> RSE String
evalExp (HandAttr _ h attr) = do
  (_, lenAttr, featureAttr) <- get
  hCode <- evalHand h
  if attr `elem` lenAttr then do
    return $ "len(" ++ hCode ++ "." ++ showIdent attr ++ ")"
  else do
    if attr `elem` featureAttr then do
      return $ hCode ++ "." ++ showIdent attr
    else do
      return $ showIdent attr ++ "(" ++ hCode ++ ")"

evalExp (ELitInt _ i) = return $ show i

evalExp (ELitTrue _) = return "True"

evalExp (ELitFalse _) = return "False"

evalExp (ENot _ e) = do
  eCode <- evalExp e
  return $ "not (" ++ eCode ++ ")"

evalExp (ERel _ e1 op e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  opCode <- evalRelOp op
  return $ "(" ++ e1Code ++ " " ++ opCode ++ " " ++ e2Code ++ ")"

evalExp (EAnd _ e1 e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  return $ "(" ++ e1Code ++ " and " ++ e2Code ++ ")"

evalExp (EOr _ e1 e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  return $ "(" ++ e1Code ++ " or " ++ e2Code ++ ")"

showIdent :: Ident -> String
showIdent (Ident ident) = ident

evalRelOp (LTH _) = return "<"

evalRelOp (LE _) = return "<="

evalRelOp (GTH _) = return ">"

evalRelOp (GE _) = return ">="

evalRelOp (EQU _) = return "=="

evalRelOp (NE _) = return "!="

evalHand (HandN _) = return "deal.north"

evalHand (HandS _) = return "deal.south"

evalHand (HandE _) = return "deal.east"

evalHand (HandW _) = return "deal.west"

evalCard (CardA _) = return "A"

evalCard (CardK _) = return "K"

evalCard (CardQ _) = return "Q"

evalCard (CardJ _) = return "J"

evalCard (CardT _) = return "T"

evalCard (Card9 _) = return "9"

evalCard (Card8 _) = return "8"

evalCard (Card7 _) = return "7"

evalCard (Card6 _) = return "6"

evalCard (Card5 _) = return "5"

evalCard (Card4 _) = return "4"

evalCard (Card3 _) = return "3"

evalCard (Card2 _) = return "2"