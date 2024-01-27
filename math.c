#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int add(int x, int y) { return x + y; }

int sub(int x, int y) { return x - y; }

int mul(int x, int y) { return x * y; }

// Helper function to clamp a value between 0 and 255
static uint8_t clamp(int value) {
  return (value < 0) ? 0 : (value > 255) ? 255 : (uint8_t)value;
}

void logPixelValues(int x, int y, int r, int g, int b) {
  printf("Pixel at (%d, %d) - R: %d, G: %d, B: %d\n", x, y, r, g, b);
}

// Function to apply sepia filter
void sepia_filter(int width, int height, uint8_t *buffer) {

  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x += 3) {
      logPixelValues(x, y, buffer[y * width + x], buffer[y * width + x + 1],
                     buffer[y * width + x + 2]);

      int r = buffer[y * width + x];
      int g = buffer[y * width + x + 1];
      int b = buffer[y * width + x + 2];

      int out_r = clamp((int)(r * .393) + (int)(g * .769) + (int)(b * .189));
      int out_g = clamp((int)(r * .349) + (int)(g * .686) + (int)(b * .168));
      int out_b = clamp((int)(r * .272) + (int)(g * .534) + (int)(b * .131));

      buffer[y * width + x] = out_r;
      buffer[y * width + x + 1] = out_g;
      buffer[y * width + x + 2] = out_b;
    }
  }
}

char *allocate(size_t size) {
  char *ptr = malloc(size * sizeof(char));
  return ptr;
}

void destroy(void *ptr) { free(ptr); }