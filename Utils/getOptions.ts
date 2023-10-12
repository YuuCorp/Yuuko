export function getOptions<ReturnType>(options: { get: (key: string) => any }, keys: (keyof ReturnType)[]): ReturnType {
  const res = {} as any;
  for (const key of keys as any) res[key] = options.get(key)?.value;

  return res;
}

export default getOptions;
