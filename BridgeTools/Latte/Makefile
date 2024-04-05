GHC=ghc

SRC_DIR= src
BUILD_DIR= build
EXE = latte_py

SOURCES= \
	$(SRC_DIR)/Abs.hs \
	$(SRC_DIR)/Lex.hs \
	$(SRC_DIR)/Par.hs \
	$(SRC_DIR)/Print.hs \
	$(SRC_DIR)/Skel.hs \
	$(SRC_DIR)/ErrM.hs \
	$(SRC_DIR)/Compiler.hs \

OBJS=$(BUILD_DIR)/*.o
IFACES=$(BUILD_DIR)/*.hi

${EXE}: $(SOURCES)
	$(GHC) -i$(SRC_DIR) -outputdir $(BUILD_DIR) -o $@ $(SRC_DIR)/Compiler.hs

.PHONY: clean

clean:
	rm -rf ${BUILD_DIR} ${EXE}
