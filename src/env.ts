import { z } from "zod";

const envSchema = z.object({
    TOKEN: z.string().min(1),
    TRUSTED_USERS: z.string().transform((value) => value.split(',').map(s => s.trim())),
    RSS_LIMIT: z.coerce.number().optional().default(5),
    ANILIST_API: z.string().optional().default("https://graphql.anilist.co"),
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    UPTIME: z.coerce.number().optional().default(Date.now()),
    API_PORT: z.coerce.number().optional().default(3030),
    NODE_ENV: z.literal("docker").or(z.literal("development")).or(z.literal("production")).optional(),
});

type envSchema = z.infer<typeof envSchema>;
export const env = () => envSchema.parse(process.env);

export default { env, envSchema };