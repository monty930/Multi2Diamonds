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

type StoreT = M.Map Ident VarType

type RSET a = StateT StoreT (ExceptT String IO) a

data VarType = Shape | Handling | Evaluator | Unique

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
    rse <- runExceptT (runStateT (checkProgram ast) M.empty)
    return ()

checkProgram :: Prog -> RSET ()
checkProgram (Program _ topdefs) = do
    checTopDefs topdefs

checTopDefs :: [TopDef] -> RSET ()
checTopDefs [] = return ()
checTopDefs (x:xs) = do
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

checkTopDef (TopDefEval _ ident evalVals) = do
    checkTopDefEval ident evalVals

checkTopDef (TopDefHold _ ident expr) = do
    checkTopDefHold ident expr

checkTopDef _ = undefined -- intended

checkTopDefShape :: ShapeDef -> RSET ()
checkTopDefShape _ = return ()

checkTopDefEval :: Ident -> [EvalVal] -> RSET ()
checkTopDefEval _ _ = return ()

checkTopDefHold :: Ident -> HoldingExpr -> RSET ()
checkTopDefHold _ _ = return ()

checkHandPredeals :: [HandPredeal] -> RSET ()
checkHandPredeals _ = return ()

checkFinalExpr :: Expr -> RSET ()
checkFinalExpr _ = return ()