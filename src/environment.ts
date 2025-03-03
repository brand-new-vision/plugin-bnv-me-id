import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const bnvEnvSchema = z.object({
    OUTFIT_CREATION_FREQUENCY: z.number().int().positive().default(8),
    BNV_URL: z.string().url().default("https://bnv.el"),
});

export type SuiConfig = z.infer<typeof bnvEnvSchema>;

export async function validateSuiConfig(
    runtime: IAgentRuntime
): Promise<SuiConfig> {
    try {
        const config = {
            OUTFIT_CREATION_FREQUENCY:
                runtime.getSetting("OUTFIT_CREATION_FREQUENCY") ||
                process.env.OUTFIT_CREATION_FREQUENCY,
            BNV_URL: runtime.getSetting("BNV_URL") || process.env.BNV_URL,
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
