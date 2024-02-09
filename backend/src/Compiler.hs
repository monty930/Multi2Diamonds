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
import           Test.QuickCheck       (label)

type Loc = Int

type Ident = String

type Env = M.Map Ident Loc

type Store = M.Map Loc Type

type RSE a = ReaderT Env (StateT Store (ExceptT String IO)) a

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
      let store = M.empty
      let env = M.empty
      let header =
            "from redeal import *\n\n" ++ 
            "def accept(deal):\n\treturn "
      pythonCode <-
        runExceptT
          (runStateT (runReaderT (generatePythonCode ast) env) store)
      case pythonCode of
        Left err -> putStrLn err
        Right (pythonCode, _) -> do
          let outputPathLLVM = directory </> baseName <.> "ll"
          putStrLn $ header ++ pythonCode

typeCheck :: Prog -> IO ()
typeCheck prog = return ()

generatePythonCode :: Prog -> RSE String
generatePythonCode (Program expr) = evalExp expr

evalExp :: Expr -> RSE String
evalExp (EVar hand attr) = evalVar hand attr

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

evalVar h (LenAttr a) = do
  hCode <- evalHand h
  aCode <- evalLenAttr a
  return $ "len(" ++ hCode ++ "." ++ aCode ++ ")"

evalVar h (SimpAttr a) = do
  hCode <- evalHand h
  aCode <- evalSimpAttr a
  return $ hCode ++ "." ++ aCode

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

evalLenAttr :: LenAttr -> RSE String
evalLenAttr AttrSpades = return "spades"

evalLenAttr AttrHearts = return "hearts"

evalLenAttr AttrDiams = return "diamonds"

evalLenAttr AttrClubs = return "clubs"

evalSimpAttr :: SimpAttr -> RSE String
evalSimpAttr AttrHcp = return "hcp"