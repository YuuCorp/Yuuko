import { z } from "zod";

const envSchema = z.object({
    TOKEN: z.string(),
    TRUSTED_USERS: z.string().transform((value) => value.split(',').map(s => s.trim())),
    RSS_LIMIT: z.string().transform((value) => parseInt(value)),
    ANILIST_API: z.string(),
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    UPTIME: z.string().transform((value) => parseInt(value)),
    PORT: z.string().transform((value) => parseInt(value)),
});

type EnvSchemaType = z.infer<typeof envSchema>;
export const verifyEnv = () => envSchema.parse(process.env);

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvSchemaType { }
    }
}
