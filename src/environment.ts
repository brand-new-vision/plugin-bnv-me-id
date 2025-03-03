import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const CONFIG_KEYS = {
    OUTFIT_CREATION_FREQUENCY: 8,
    BNV_URL: "https://bnv-me-id-api.bnv.me",
};

export const bnvEnvSchema = z.object({
    OUTFIT_CREATION_FREQUENCY: z.number().int().positive().default(8),
    BNV_URL: z.string().url().default("https://bnv-me-id-api.bnv.me"),
});

export type BnvConfig = z.infer<typeof bnvEnvSchema>;

export async function validateBnvConfig(
    runtime: IAgentRuntime
): Promise<BnvConfig> {
    try {
        const config = {
            OUTFIT_CREATION_FREQUENCY:
                runtime.getSetting(CONFIG_KEYS.OUTFIT_CREATION_FREQUENCY.toString()) ||
                process.env.OUTFIT_CREATION_FREQUENCY,
            BNV_URL: runtime.getSetting(CONFIG_KEYS.BNV_URL) || process.env.BNV_URL,
        };

        return bnvEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Bnv configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
