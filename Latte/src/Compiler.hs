--  Krystyna Gasinska --
--  BridgeLatte compiler 2024 --
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
generatePythonCode (Program defs expr) = do
  defsCode <- evalDefs defs
  exprCode <- evalExp expr
  return $ defsCode ++ "\ndef accept(deal):\n\treturn " ++ exprCode

generatePythonCode (EmptyProg _) = return "\ndef accept(deal):\n\treturn True"

evalDefs :: [Def] -> RSE String
evalDefs (def : defs) = do
  defCode <- evalDef def
  defsCode <- mapM evalDef defs
  return $ defCode ++ concat defsCode

evalDefs [] = return ""

evalDef :: Def -> RSE String
evalDef (TopDefShape (ShapeDef (Ident id) shapes)) = do
  shapesCode <- evalShapes shapes
  return $ id ++ " = " ++ shapesCode ++ "\n"

evalDef (TopDefEval eval) = undefined

evalShapes [sh] = do
  evalShape sh

evalShapes (sh : shs) = do
  shCode <- evalShape sh
  shsCode <- evalShapes shs
  return $ shCode ++ "+" ++ shsCode

evalShapes [] = undefined

-- evalShape :: Shape -> RSE String
-- evalShape (ShapeOk (OneShapeOk scs)) = do
--   scsCodes <- mapM evalSuitCount scs
--   return $ "Shape(\"" ++ concat scsCodes ++ "\")"

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

evalExp :: Expr -> RSE String
-- evalExp (HandAttr hand attr) = evalVar hand attr

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

evalExp (Not e) = do
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

-- evalExp (HandSimpAttr a h) = do
--   hCode <- evalHand h
--   aCode <- evalSimpAttr a
--   return $ hCode ++ "." ++ aCode

-- evalVar h (LenAttr a) = do
--   hCode <- evalHand h
--   aCode <- evalLenAttr a
--   return $ "len(" ++ hCode ++ "." ++ aCode ++ ")"

-- evalVar h (AttrVar ident) = do
--   hCode <- evalHand h
--   return $ showIdent ident ++ "(" ++ hCode ++ ")"

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

-- evalLenAttr :: LenAttr -> RSE String
-- evalLenAttr AttrSpades = return "spades"

-- evalLenAttr AttrHearts = return "hearts"

-- evalLenAttr AttrDiams = return "diamonds"

-- evalLenAttr AttrClubs = return "clubs"

-- evalSimpAttr :: SimpAttr -> RSE String
-- evalSimpAttr AttrHcp = return "hcp"

-- evalSimpAttr AttrFreak = return "freakness"

-- evalSimpAttr AttrLoser = return "losers"