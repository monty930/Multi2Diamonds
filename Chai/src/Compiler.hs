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
                                        takeFileName, (<.>), (</>))
import           System.FilePath.Posix
import           System.IO
import           System.Process
import           Test.QuickCheck       (label)

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
            [Ident "spades", Ident "hearts", Ident "clubs", Ident "diams"],
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

typeCheck :: Prog -> IO ()
typeCheck prog = return ()

generatePythonCode :: Prog -> RSE String
generatePythonCode (Program topdefs) = do
  evalTopDefs topdefs

evalTopDefs ((TopDefPredeal p) : topdefs) = do
  pCode <- evalPredeal p
  topDefsCode <- evalTopDefs topdefs
  return $ pCode ++ topDefsCode

evalTopDefs ((Final f) : topdefs) = do
  fCode <- evalFinal f
  topDefsCode <- evalTopDefs topdefs
  return $ fCode ++ topDefsCode

evalTopDefs ((TopDefShape sh) : topdefs) = do
  shCode <- evalTopShape sh
  topDefsCode <- evalTopDefs topdefs
  return $ shCode ++ topDefsCode

evalTopDefs ((TopDefEval id vals) : topdefs) = do
  evCode <- evalTopEv id vals
  topDefsCode <- evalTopDefs topdefs
  return $ evCode ++ topDefsCode

evalTopDefs [] = return "\n"

evalTopShape (ShapeCond id shE) = undefined

evalTopShape (ShapeLit id shapes) = do
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
    isShapeOk (ShapeOk _) = True
    isShapeOk _ = False
    isShapeNeg (ShapeNeg _) = True
    isShapeNeg _ = False

evalShape :: Shape -> RSE String
evalShape (ShapeOk sh) = evalShapeOk sh
evalShape (ShapeNeg sh) = evalShapeNeg sh

evalShapeOk (OneShapeOk scs) = do
  scsCodes <- mapM evalSuitCount scs
  return $ "Shape(\"" ++ concat scsCodes ++ "\")"

evalShapeNeg (OneShapeNeg (OneShapeOk scs)) = do
  scsCodes <- mapM evalSuitCount scs
  return $ "Shape(\"" ++ concat scsCodes ++ "\")"


evalSuitCount :: SuitCount -> RSE String
evalSuitCount a = do
  case a of
    (SuitIntCount (SuitInt a)) -> return $ show a
    (SuitChoice as) -> do
      asCodes <- mapM evalSuitInt as
      return $ "(" ++ concat asCodes ++ ")"

evalSuitInt :: SuitInt -> RSE String
evalSuitInt (SuitInt a) = return $ show a

evalTopEv ident vals = do
  valsCode <- evalEvValsCode vals
  return $ showIdent ident ++ " = Evaluator(" ++ valsCode ++ ")\n"

evalEvValsCode :: [EvalVal] -> RSE String
evalEvValsCode [EvalVal val] = 
  return $ show val

evalEvValsCode ((EvalVal val) : vals) = do
  valsCode <- evalEvValsCode vals
  return $ show val ++ ", " ++ valsCode

evalEvValsCode [] = undefined -- intended

evalFinal expr = do
  exprCode <- evalExp expr
  return $ "\ndef accept(deal):\n\treturn " ++ exprCode

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
evalOneHandPre (HandPredeal h hf) = do
  hCode <- case h of
    HandN -> return "N"
    HandE -> return "E"
    HandS -> return "S"
    HandW -> return "W"
  hfCode <- evalHandFeatureCode hf
  return $ "\"" ++ hCode ++ "\": " ++ hfCode

evalHandFeatureCode :: HandFeature -> RSE String
evalHandFeatureCode (HandLit str) = return $ "\"" ++ str ++ "\""

evalHandFeatureCode (SmartStackShape shape) = do
  return $ "SmartStack(" ++ showIdent shape ++ ", Evaluator(4,3,2,1), range(0, 40))"

evalHandFeatureCode (SmartStackFull shape eval val) = do
  valCode <- evalVal val
  return $ "SmartStack(" ++ showIdent shape ++ "," ++ showIdent eval ++ ", range" ++ valCode ++ ")"

evalVal (ValueRange int1 int2) = do
  return $ "(" ++ show int1 ++ "," ++ show int2 ++")"

evalExp :: Expr -> RSE String
evalExp (HandAttr h attr) = do
  (_, lenAttr, featureAttr) <- get
  hCode <- evalHand h
  if attr `elem` lenAttr then do
    return $ "len(" ++ hCode ++ "." ++ showIdent attr ++ ")"
  else do
    if attr `elem` featureAttr then do
      return $ hCode ++ "." ++ showIdent attr
    else do
      return $ showIdent attr ++ "(" ++ hCode ++ ")"

evalExp (ELitInt i) = return $ show i

evalExp ELitTrue = return "True"

evalExp ELitFalse = return "False"

evalExp (ENot e) = do
  eCode <- evalExp e
  return $ "not (" ++ eCode ++ ")"

evalExp (ERel e1 op e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  opCode <- evalRelOp op
  return $ "(" ++ e1Code ++ " " ++ opCode ++ " " ++ e2Code ++ ")"

evalExp (EAnd e1 e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  return $ "(" ++ e1Code ++ " and " ++ e2Code ++ ")"

evalExp (EOr e1 e2) = do
  e1Code <- evalExp e1
  e2Code <- evalExp e2
  return $ "(" ++ e1Code ++ " or " ++ e2Code ++ ")"

showIdent :: Ident -> String
showIdent (Ident ident) = ident

evalRelOp LTH = return "<"

evalRelOp LE = return "<="

evalRelOp GTH = return ">"

evalRelOp GE = return ">="

evalRelOp EQU = return "=="

evalRelOp NE = return "!="

evalHand HandN = return "deal.north"

evalHand HandS = return "deal.south"

evalHand HandE = return "deal.east"

evalHand HandW = return "deal.west"