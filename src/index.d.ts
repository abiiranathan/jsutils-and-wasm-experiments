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
export declare const throttle: (fn: Function, wait: number) => (this: any) => void;
/**
 * @description Debounce a function call.
 * @param fn  Function to be called.
 * @param wait  Time in milliseconds.
 * @returns
 */
export declare const debounce: (fn: Function, wait: number) => (this: any) => void;
/**
 * @description Get the current window width.
 * @returns
 */
export declare const getWindowWidth: () => number;
/**
 * @description Get the current window height.
 * @returns
 */
export declare const getWindowHeight: () => number;
/**
 * @description Get the current window scroll position.
 * @returns
 */
export declare const getWindowScroll: () => number;
/**
 * @description Get the current window scroll position.
 * @returns
 */
export declare const getDocumentHeight: () => number;
/**
 * @description Check if an element is in the viewport.
 * @param el  Element to check.
 * @returns
 */
export declare const isInViewport: (el: HTMLElement) => boolean;
/**
 * @description Check if an element is intersecting the viewport.
 * @param el  Element to check.
 * @returns A function to disconnect the observer.
 */
export declare const isIntersecting: (el: HTMLElement, options?: IntersectionObserverInit) => () => void;
/**
 *  Render an image to a canvas element that is appended to the given element.
 * @param el Element to append the canvas to.
 * @param src Image source. Can be a string or a File object.
 * @param dimens Dimensions of the canvas.
 * @param options ImageBitmapOptions.
 */
export declare const renderImage: (el: HTMLElement, src: string | File, dimens?: {
    width: number;
    height: number;
}, options?: ImageBitmapOptions) => void;
declare enum ReadOptions {
    ArrayBuffer = 0,
    BinaryString = 1,
    DataURL = 2,
    Text = 3
}
/**
 * Read File object.
 */
export declare function readFile<T extends ArrayBuffer | string>(file: File, option?: ReadOptions): Promise<T>;
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
export declare function uploadFiles<T>({ url, files, formName, onProgress, headers, }: UploadFilesOptions<T>): Promise<T>;
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
export declare function downloadFile({ url, filename, headers, }: DownloadFileOptions): Promise<void>;
/** Image functions and filters */
/**
 * @description Convert a canvas to an image.
 * @param canvas
 * @returns
 */
export declare function canvasToImage(canvas: HTMLCanvasElement): HTMLImageElement;
export declare function sepiaFilter(imageData: ImageData): ImageData;
export declare function brightnessFilter(imageData: ImageData, brightness: number): ImageData;
export declare function contrastFilter(imageData: ImageData, contrast: number): ImageData;
export declare function grayscaleFilter(imageData: ImageData): ImageData;
export declare function invertFilter(imageData: ImageData): ImageData;
export declare function blurFilter(imageData: ImageData, blur: number): ImageData;
export declare function sharpenFilter(imageData: ImageData, sharpen: number): ImageData;
export declare function edgeDetectionFilter(imageData: ImageData): ImageData;
/**
 * @description Rotate an image.
 * @param imageData ImageData object. Obtained from canvas.getContext("2d").getImageData().
 * @param angle Angle in degrees. e.g 90, 180, 270.
 * @returns
 */
export declare function rotateImage(imageData: ImageData, angle: number): ImageData;
export declare function flipImage(imageData: ImageData, direction: "horizontal" | "vertical"): ImageData;
/**
 * Import wasm module with instantiateStreaming
 * @param url
 * @returns
 */
export declare function importWasmModule<T extends WebAssembly.Exports>(url: string): Promise<T>;
/**
 * Import wasm module with instantiate
 * @param url
 * @returns
 */
export declare function importWasmModule2<T extends WebAssembly.Exports>(url: string): Promise<T>;
/**
 * @description Get a media stream from the webcam in a cross-browser way.
 * @returns
 */
/**
 * @description Get a media stream from the webcam in a cross-browser way.
 * @returns
 */
export declare function getMediaStream(constraints?: MediaStreamConstraints): Promise<MediaStream>;
export declare function muteVideo(video: HTMLVideoElement): void;
export declare function unmuteVideo(video: HTMLVideoElement): void;
export declare function pauseVideo(video: HTMLVideoElement): void;
export declare function playVideo(video: HTMLVideoElement): void;
export declare function stopVideo(video: HTMLVideoElement): void;
export declare function getVideoStream(video: HTMLVideoElement): MediaStream;
/**
 * Get desktop screen capture.
 */
export declare function getDisplayMedia(): Promise<MediaStream>;
export declare function renderMediaStream(stream: MediaStream, video: HTMLVideoElement): void;
/** Capture screenshot from a video element.
 * @param video Video element.
 * @param filename Filename of the screenshot.
 * @param download Download the screenshot.
 * @returns Canvas element if download is false or undefined.
 */
export declare function captureScreenshot(video: HTMLVideoElement, { filename, download }: {
    filename?: string;
    download?: boolean;
}): HTMLCanvasElement | undefined;
/**
 *  @description Speak text using the Web Speech API.
 * @param text
 * @param options
 */
export declare function speak(text: string, options?: SpeechSynthesisUtterance): Promise<void>;
/**
 * @description Stop speaking.
 */
export declare function stopSpeaking(): void;
export declare function autoResizeTextarea(textarea: HTMLTextAreaElement): void;
/** Set default options for each select element on the page.
 * This is useful for setting default values for select elements that are populated
 * from server-side templates in vanilla JavaScript. (Unlike in many frameworks)
 */
export declare function setDefaultSelectOptions(): void;
/** onClickOutside
 * @description Call a function when a user clicks outside an element.
 * @param el Element to check.
 * @param fn Function to call.
 */
export declare function onClickOutside(el: HTMLElement, fn: Function): () => void;
export declare function getCookie(name: string): string | undefined;
export declare function setCookie(name: string, value: string): void;
/**
 *  Streaming fetch: https://stackoverflow.com/questions/53005361/how-to-stream-fetch-response-body
 * This is useful for streaming large files. The response body is a ReadableStream.
 * The server must support streaming e.g Node.js with res.write() or res.pipe() or golang with http.ResponseWriter.
 * @param url URL to fetch.
 * @param options Fetch options.
 * @returns
 */
export declare function streamingFetch(url: string, options?: RequestInit): Promise<Response>;
export declare function createModal(options: {
    title: string;
    content: string;
    buttons?: {
        text: string;
        onClick: () => void;
    }[];
}): HTMLDivElement;
export declare function closeModal(modal: HTMLElement): void;
export {};
