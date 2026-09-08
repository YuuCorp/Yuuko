import { logger } from "#utils/logger";

/**
 * Safely bridges an async event listener to a synchronous EventEmitter handler,
 * suppressing `ts/no-misused-promises` while catching unhandled rejections.
 */
export function handleAsync<Args extends unknown[]>(
    fn: (...args: Args) => Promise<unknown>,
): (...args: Args) => void {
    return (...args: Args) => {
        void fn(...args).catch((error: unknown) => {
            return logger.error("Unhandled async event error", {
                error: error instanceof Error ? error.message : String(error),
                type: "generic"
            });
        });
    };
}