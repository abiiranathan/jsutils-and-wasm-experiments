CC=emcc
RAYLIB_SRC=$(HOME)/raylib-master/src

all:
	$(CC) -O3 math.c -o math.js -s WASM=1 \
	-s EXPORTED_FUNCTIONS="['_sepia_filter', '_logPixelValues', '_allocate', '_destroy', '_add', '_sub', '_mul']" \
	-sERROR_ON_UNDEFINED_SYMBOLS=0

game:
	emcc -o game.html game.c -Wall -std=c99 \
	 -D_DEFAULT_SOURCE -Wno-missing-braces \
	 -Wunused-result -O3 -I. -I $(RAYLIB_SRC) \
	 -I $(RAYLIB_SRC)/external -L. -L $(RAYLIB_SRC) \
	 -s USE_GLFW=3 -s ASYNCIFY -s TOTAL_MEMORY=67108864 \
	 -s FORCE_FILESYSTEM=1 --shell-file $(RAYLIB_SRC)/shell.html \
	 $(RAYLIB_SRC)/web/libraylib.a -DPLATFORM_WEB \
	 -s 'EXPORTED_FUNCTIONS=["_free","_malloc","_main"]' \
	 -s EXPORTED_RUNTIME_METHODS=ccall

clean:
	rm -rf *.wasm game.js game.html math.wasm math.js