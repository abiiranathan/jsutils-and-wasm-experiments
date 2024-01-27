/**
 * DOM compatible JavaScript library for building user interfaces.
 * Path: src/index.ts
 */

/**
 * @description Call a function only once in a given time frame.
 * @param fn  Function to be called.
 * @param wait  Time in milliseconds.
 * @returns
 */
export function throttle(func: Function, delay: number) {
  let wait = false;
  let storedArgs: any = null;

  function checkStoredArgs() {
    if (storedArgs == null) {
      wait = false;
    } else {
      func(...storedArgs);
      storedArgs = null;
      setTimeout(checkStoredArgs, delay);
    }
  }

  return (...args: any) => {
    if (wait) {
      storedArgs = args;
      return;
    }

    func(...args);
    wait = true;
    setTimeout(checkStoredArgs, delay);
  };
}

/**
 * @description Debounce a function call.
 * @param fn  Function to be called.
 * @param wait  Time in milliseconds.
 * @returns
 */
export function debounce(func: Function, delay: number) {
  let timeoutId: number;

  return (...args: any) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
    }, delay);
  };
}
/**
 * @description Get the current window width.
 * @returns
 */
export const getWindowWidth = () => {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
};

/**
 * @description Get the current window height.
 * @returns
 */
export const getWindowHeight = () => {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
};

/**
 * @description Get the current window scroll position.
 * @returns
 */
export const getWindowScroll = () => {
  return (
    window.scrollY ||
    document.body.scrollTop ||
    document.documentElement.scrollTop
  );
};

/**
 * @description Get the current window scroll position.
 * @returns
 */
export const getDocumentHeight = () => {
  return document.body.scrollHeight || document.documentElement.scrollHeight;
};

/**
 * @description Check if an element is in the viewport.
 * @param el  Element to check.
 * @returns
 */
export const isInViewport = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= getWindowHeight() &&
    rect.right <= getWindowWidth()
  );
};

/**
 * @description Check if an element is intersecting the viewport.
 * @param el  Element to check.
 * @returns A function to disconnect the observer.
 */
export const isIntersecting = (
  el: HTMLElement,
  options?: IntersectionObserverInit
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      return entry.isIntersecting;
    }, options);
  });
  observer.observe(el);
  return () => observer.disconnect();
};

/**
 *  Render an image to a canvas element that is appended to the given element.
 * @param el Element to append the canvas to.
 * @param src Image source. Can be a string or a File object.
 * @param dimens Dimensions of the canvas.
 * @param options ImageBitmapOptions.
 */
export const renderImage = (
  el: HTMLElement,
  src: string | File,
  dimens?: { width: number; height: number },
  options?: ImageBitmapOptions
) => {
  // create a new image element
  const img = document.createElement("img");
  img.src = typeof src === "string" ? src : URL.createObjectURL(src);

  img.onload = () => {
    createImageBitmap(img, options).then((bitmap) => {
      // we now have a bitmap of the image
      const canvas = document.createElement("canvas");
      canvas.width = dimens?.width || bitmap.width;
      canvas.height = dimens?.height || bitmap.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(bitmap, 0, 0);
      el.appendChild(canvas);
    });
  };
};

enum ReadOptions {
  ArrayBuffer,
  BinaryString,
  DataURL,
  Text,
}

/**
 * Read File object.
 */
export async function readFile<T extends ArrayBuffer | string>(
  file: File,
  option?: ReadOptions
): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as T);
    reader.onerror = (error) => reject(error);

    switch (option) {
      case ReadOptions.ArrayBuffer:
        reader.readAsArrayBuffer(file);
        break;
      case ReadOptions.BinaryString:
        reader.readAsBinaryString(file);
        break;
      case ReadOptions.DataURL:
        reader.readAsDataURL(file);
        break;
      case ReadOptions.Text:
        reader.readAsText(file);
        break;
      default:
        reader.readAsArrayBuffer(file);
        break;
    }
  });
}

export interface UploadFilesOptions<T> {
  url: string;
  files: File[];
  formName?: string;
  onProgress?: (progress: number) => void;
  headers?: Record<string, string>;
}

/**
 * @description Upload files to a server.
 * @param options
 * - url:  URL to upload to.
 * - files:  Files to upload.
 * - formName:  Name of the form field. Defaults to "files[]".
 * - onProgress:  Callback for progress.
 * - headers:  Custom headers. Defaults to {}.
 * @returns
 */
export async function uploadFiles<T>({
  url,
  files,
  formName = "files[]",
  onProgress,
  headers = {},
}: UploadFilesOptions<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach((file) => formData.append(formName, file));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    // Set custom headers
    Object.keys(headers).forEach((header) => {
      xhr.setRequestHeader(header, headers[header]);
    });

    // Listen to the upload progress.
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = event.loaded / event.total;
        onProgress(progress);
      }
    });

    // Handle completion and errors.
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // If successful, resolve the promise by passing back the request response.
        resolve(xhr.response as T);
      } else {
        const errorMessage = `Failed to upload files. Status: ${xhr.status}`;
        console.error(errorMessage);
        reject(new Error(errorMessage));
      }
    };

    xhr.onerror = () => {
      const errorMessage = "Network error during upload";
      console.error(errorMessage);
      reject(new Error(errorMessage));
    };

    // Send the FormData with the files.
    xhr.send(formData);
  });
}

/**
 * @description Download a file from a URL.
 */

export interface DownloadFileOptions {
  url: string;
  filename?: string;
  headers?: Record<string, string>;
}

/**
 * @description Download a file from a URL.
 * @param options
 */
export async function downloadFile({
  url,
  filename,
  headers = {},
}: DownloadFileOptions) {
  const response = await fetch(url, {
    headers,
  });

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename || "";
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

/** Image functions and filters */

/**
 * @description Convert a canvas to an image.
 * @param canvas
 * @returns
 */
export function canvasToImage(canvas: HTMLCanvasElement) {
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
}

// Sepia filter
export function sepiaFilter(imageData: ImageData) {
  const { data } = imageData;
  const length = data.length;

  for (let i = 0; i < length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }

  return imageData;
}

// Brightness filter
export function brightnessFilter(imageData: ImageData, brightness: number) {
  const { data } = imageData;
  const length = data.length;

  for (let i = 0; i < length; i += 4) {
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
  }

  return imageData;
}

// Contrast filter
export function contrastFilter(imageData: ImageData, contrast: number) {
  const { data } = imageData;
  const length = data.length;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }

  return imageData;
}

// Grayscale filter
export function grayscaleFilter(imageData: ImageData) {
  const { data } = imageData;
  const length = data.length;

  for (let i = 0; i < length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = data[i + 1] = data[i + 2] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  return imageData;
}

// Invert filter
export function invertFilter(imageData: ImageData) {
  const { data } = imageData;
  const length = data.length;

  for (let i = 0; i < length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }

  return imageData;
}

// Blur filter
export function blurFilter(imageData: ImageData, blur: number) {
  const { data, width } = imageData;
  const length = data.length;
  const matrixSize = blur * 2 + 1;
  const radius = blur + 1;
  const matrix = new Array(matrixSize * matrixSize).fill(
    1 / (matrixSize * matrixSize)
  );

  for (let i = 0; i < length; i += 4) {
    const r = [];
    const g = [];
    const b = [];

    for (let j = 0; j < matrixSize; j++) {
      const x = i + j * 4 - radius * 4;
      const y = i + j * 4 * width - radius * 4 * width;

      for (let k = 0; k < matrixSize; k++) {
        const m = matrix[j * matrixSize + k];
        const z = x + k * 4;

        r.push(data[z] * m);
        g.push(data[z + 1] * m);
        b.push(data[z + 2] * m);
      }
    }

    data[i] = r.reduce((a, b) => a + b);
    data[i + 1] = g.reduce((a, b) => a + b);
    data[i + 2] = b.reduce((a, b) => a + b);
  }

  return imageData;
}

// Sharpen filter
export function sharpenFilter(imageData: ImageData, sharpen: number) {
  const { data, width } = imageData;
  const length = data.length;
  const matrixSize = sharpen * 2 + 1;
  const radius = sharpen + 1;

  const matrix = new Array(matrixSize * matrixSize).fill(
    -1 / (matrixSize * matrixSize)
  );
  matrix[radius * matrixSize + radius] = 1;

  for (let i = 0; i < length; i += 4) {
    const r = [];
    const g = [];
    const b = [];

    for (let j = 0; j < matrixSize; j++) {
      const x = i + j * 4 - radius * 4;
      const y = i + j * 4 * width - radius * 4 * width;

      for (let k = 0; k < matrixSize; k++) {
        const m = matrix[j * matrixSize + k];
        const z = x + k * 4;

        r.push(data[z] * m);
        g.push(data[z + 1] * m);
        b.push(data[z + 2] * m);
      }
    }

    data[i] = r.reduce((a, b) => a + b);
    data[i + 1] = g.reduce((a, b) => a + b);
    data[i + 2] = b.reduce((a, b) => a + b);
  }

  return imageData;
}

// Edge detection filter
export function edgeDetectionFilter(imageData: ImageData) {
  const { data, width } = imageData;
  const length = data.length;
  const matrixSize = 3;
  const radius = 1;

  const matrix = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

  for (let i = 0; i < length; i += 4) {
    const r = [];
    const g = [];
    const b = [];

    for (let j = 0; j < matrixSize; j++) {
      const x = i + j * 4 - radius * 4;
      const y = i + j * 4 * width - radius * 4 * width;

      for (let k = 0; k < matrixSize; k++) {
        const m = matrix[j * matrixSize + k];
        const z = x + k * 4;

        r.push(data[z] * m);
        g.push(data[z + 1] * m);
        b.push(data[z + 2] * m);
      }
    }

    data[i] = r.reduce((a, b) => a + b);
    data[i + 1] = g.reduce((a, b) => a + b);
    data[i + 2] = b.reduce((a, b) => a + b);
  }

  return imageData;
}

/**
 * @description Rotate an image.
 * @param imageData ImageData object. Obtained from canvas.getContext("2d").getImageData().
 * @param angle Angle in degrees. e.g 90, 180, 270.
 * @returns
 */
export function rotateImage(imageData: ImageData, angle: number) {
  const { data, width, height } = imageData;
  const length = data.length;
  const angleInRadians = (angle * Math.PI) / 180;
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  const newWidth = Math.round(Math.abs(width * cos) + Math.abs(height * sin));
  const newHeight = Math.round(Math.abs(width * sin) + Math.abs(height * cos));

  const newImageData = new ImageData(newWidth, newHeight);

  for (let i = 0; i < length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);

    const newX = Math.round(x * cos + y * sin);
    const newY = Math.round(y * cos - x * sin);

    const newIndex = (newY * newWidth + newX) * 4;

    newImageData.data[newIndex] = data[i];
    newImageData.data[newIndex + 1] = data[i + 1];
    newImageData.data[newIndex + 2] = data[i + 2];
    newImageData.data[newIndex + 3] = data[i + 3];
  }

  return newImageData;
}

// Flip image
export function flipImage(
  imageData: ImageData,
  direction: "horizontal" | "vertical"
) {
  const { data, width, height } = imageData;
  const length = data.length;

  const newImageData = new ImageData(width, height);

  for (let i = 0; i < length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor(i / 4 / width);

    const newX = direction === "horizontal" ? width - x : x;
    const newY = direction === "vertical" ? height - y : y;

    const newIndex = (newY * width + newX) * 4;

    newImageData.data[newIndex] = data[i];
    newImageData.data[newIndex + 1] = data[i + 1];
    newImageData.data[newIndex + 2] = data[i + 2];
    newImageData.data[newIndex + 3] = data[i + 3];
  }
  return newImageData;
}

// ========== Wasm =======================

/**
 * Import wasm module with instantiateStreaming
 * @param url
 * @returns
 */
export async function importWasmModule(
  url: string,
  importObject?: WebAssembly.Imports
) {
  const response = await fetch(url);
  const wasm = await WebAssembly.instantiateStreaming(response, importObject);
  return { exports: wasm.instance.exports, module: wasm.module };
}

// =========== WebRTC ====================
/**
 * @description Get a media stream from the webcam in a cross-browser way.
 * @returns
 */

/**
 * @description Get a media stream from the webcam in a cross-browser way.
 * @returns
 */
export async function getMediaStream(constraints?: MediaStreamConstraints) {
  const options: MediaStreamConstraints = {
    video: {
      facingMode: "user",
      width: 640,
      height: 480,
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };

  if (constraints) {
    Object.assign(options, constraints);
  }
  return navigator.mediaDevices.getUserMedia(options);
}

// Video manipulation
// mute video
export function muteVideo(video: HTMLVideoElement) {
  video.muted = true;
}

// unmute video
export function unmuteVideo(video: HTMLVideoElement) {
  video.muted = false;
}

// pause video
export function pauseVideo(video: HTMLVideoElement) {
  video.pause();
}

// play video
export function playVideo(video: HTMLVideoElement) {
  video.play();
}

// stop video
export function stopVideo(video: HTMLVideoElement) {
  video.pause();
  video.currentTime = 0;
}

// get video stream
export function getVideoStream(video: HTMLVideoElement) {
  return video.srcObject as MediaStream;
}

/**
 * Get desktop screen capture.
 */
export async function getDisplayMedia() {
  return navigator.mediaDevices.getDisplayMedia();
}

// Render a media stream to a video element.
export function renderMediaStream(
  stream: MediaStream,
  video: HTMLVideoElement
) {
  video.srcObject = stream;
  video.onloadedmetadata = () => video.play();
}

/** Capture screenshot from a video element.
 * @param video Video element.
 * @param filename Filename of the screenshot.
 * @param download Download the screenshot.
 * @returns Canvas element if download is false or undefined.
 */
export function captureScreenshot(
  video: HTMLVideoElement,
  { filename, download }: { filename?: string; download?: boolean }
) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(video, 0, 0);

  if (download) {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename || "";
    a.click();
    a.remove();

    canvas.remove();
    URL.revokeObjectURL(a.href);
  } else {
    return canvas;
  }
}

// =========== Web Speech API ====================
/**
 *  @description Speak text using the Web Speech API.
 * @param text
 * @param options
 */
export async function speak(text: string, options?: SpeechSynthesisUtterance) {
  const utterance = new SpeechSynthesisUtterance(text);
  Object.assign(utterance, options || {});
  speechSynthesis.speak(utterance);
}

/**
 * @description Stop speaking.
 */
export function stopSpeaking() {
  speechSynthesis.cancel();
}

// Auto-expanding textarea
function resizeTextArea(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
  textarea.style.overflowY = "hidden";
}

// DOM utils
export function autoResizeTextarea(textarea: HTMLTextAreaElement) {
  textarea.addEventListener("input", (event) =>
    resizeTextArea(event.currentTarget as HTMLTextAreaElement)
  );
  textarea.addEventListener("focus", (event) =>
    resizeTextArea(event.currentTarget as HTMLTextAreaElement)
  );
  textarea.addEventListener("resize", (event) =>
    resizeTextArea(event.currentTarget as HTMLTextAreaElement)
  );

  // Initial render
  resizeTextArea(textarea);
}

/** Set default options for each select element on the page.
 * This is useful for setting default values for select elements that are populated
 * from server-side templates in vanilla JavaScript. (Unlike in many frameworks)
 */
export function setDefaultSelectOptions() {
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    const options = select.querySelectorAll("option");

    options.forEach((option) => {
      if (select.getAttribute("value") == option.getAttribute("value")) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
  });
}

/** onClickOutside
 * @description Call a function when a user clicks outside an element.
 * @param el Element to check.
 * @param fn Function to call.
 */
export function onClickOutside(el: HTMLElement, fn: (e: MouseEvent) => void) {
  const handler = (event: MouseEvent) => {
    if (!el.contains(event.target as Node) && event.target !== el) {
      fn(event);
    }
  };

  document.addEventListener("pointerdown", handler);
  return () => document.removeEventListener("pointerdown", handler);
}

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(name));
  return cookie?.split("=")[1];
}

export function setCookie(
  name: string,
  value: string,
  options?: {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }
) {
  let cookie = `${name}=${value}`;

  if (options) {
    if (options.expires) {
      if (typeof options.expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookie += `; expires=${date.toUTCString()}`;
      } else {
        cookie += `; expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.path) {
      cookie += `; path=${options.path}`;
    }

    if (options.domain) {
      cookie += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookie += `; secure`;
    }

    if (options.sameSite) {
      cookie += `; samesite=${options.sameSite}`;
    }
  }
  document.cookie = cookie;
}

/**
 *  Streaming fetch: https://stackoverflow.com/questions/53005361/how-to-stream-fetch-response-body
 * This is useful for streaming large files. The response body is a ReadableStream.
 * The server must support streaming e.g Node.js with res.write() or res.pipe() or golang with http.ResponseWriter.
 * @param url URL to fetch.
 * @param options Fetch options.
 * @returns
 */
export async function streamingFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  const reader = response.body?.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
      reader.releaseLock();
    },
  });

  return new Response(stream, {
    headers: response.headers,
  });
}

// Creating a modal in vanilla JavaScript
export function createModal(options: {
  title: string;
  content: Node;
  buttons?: { text: string; onClick: () => void }[];
}) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalInner = document.createElement("div");
  modalInner.classList.add("modal-inner");

  const modalTitle = document.createElement("h2");
  modalTitle.classList.add("modal-title");

  modalTitle.innerText = options.title;
  modalInner.appendChild(modalTitle);
  modalInner.appendChild(options.content);

  if (options.buttons) {
    const modalButtons = document.createElement("div");
    modalButtons.classList.add("modal-buttons");

    options.buttons.forEach((button) => {
      const buttonEl = document.createElement("button");
      buttonEl.innerText = button.text;
      buttonEl.addEventListener("click", button.onClick);
      modalButtons.appendChild(buttonEl);
    });

    modalInner.appendChild(modalButtons);
  }

  modal.appendChild(modalInner);
  document.body.appendChild(modal);
  document.documentElement.classList.add("modal-open");
  return modal;
}

export function closeModal(modal: HTMLElement) {
  if (!modal) return;
  modal.remove();
  document.documentElement.classList.remove("modal-open");
}

/**
 *  Prevent double form submissions in vanilla JavaScript.
 * @param forms A list of forms to prevent double submissions. Defaults to all forms on the page.
 */
export function safeFormSubmit(forms?: NodeListOf<HTMLFormElement>) {
  if (!forms) {
    forms = document.querySelectorAll("form");
  }

  forms.forEach((form) => {
    // Avoid double form submissions in a space of 1s
    const formButtons = form.querySelectorAll("button");

    form.addEventListener("submit", () => {
      form.style.opacity = "0.5";
      form.style.pointerEvents = "none";
      form.style.transition = "opacity 100ms ease";

      formButtons.forEach((btn) => {
        btn.disabled = true;
      });

      let timeoutId: number;
      timeoutId = window.setTimeout(() => {
        form.style.opacity = "1";
        form.style.pointerEvents = "auto";
        form.style.transition = "opacity 100ms ease";

        window.clearTimeout(timeoutId);
        formButtons.forEach((btn) => {
          btn.disabled = false;
        });
      }, 1000);
    });
  });
}

// Client-side generic table pagination
export function paginateTable(
  table: HTMLTableElement,
  options?: {
    currentPage?: number;
    rowsPerPage?: number;
    buttonClassName?: string;
  }
) {
  const tableBody = table.querySelector("tbody");
  const tableRows = tableBody?.querySelectorAll("tr");
  const tableRowsArray = Array.from(tableRows || []);

  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.className = options?.buttonClassName || "btn btn-primary btn-sm";
  prevButton.disabled = true;

  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.className = options?.buttonClassName || "btn btn-primary btn-sm";

  const current = document.createElement("span");
  current.innerText = "1";
  current.className = "current-page";

  const pagination = document.createElement("div");
  pagination.classList.add("pagination");
  pagination.style.display = "flex";
  pagination.style.alignItems = "center";
  pagination.style.gap = "1rem";

  pagination.appendChild(prevButton);
  pagination.appendChild(current);
  pagination.appendChild(nextButton);

  table.insertAdjacentElement("afterend", pagination);

  let currentPage = options?.currentPage || 1;
  const rowsPerPage = options?.rowsPerPage || 10;
  const maxPage = Math.ceil(tableRowsArray.length / rowsPerPage);

  const renderRows = () => {
    tableRowsArray.forEach((row) => {
      row.style.display = "none";
    });

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const rowsToShow = tableRowsArray.slice(start, end);

    rowsToShow.forEach((row) => {
      row.style.display = "table-row";
    });
  };

  const checkButtons = () => {
    if (currentPage === 1) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    }

    if (currentPage === maxPage) {
      nextButton.disabled = true;
    } else {
      nextButton.disabled = false;
    }

    current.innerText = `${currentPage} / ${maxPage}`;
  };

  const prevPage = () => {
    if (currentPage === 1) return;
    currentPage--;
    renderRows();
    checkButtons();
  };

  const nextPage = () => {
    if (currentPage === maxPage) return;
    currentPage++;
    renderRows();
    checkButtons();
  };

  prevButton.addEventListener("click", prevPage);
  nextButton.addEventListener("click", nextPage);

  renderRows();
  checkButtons();
}
