export function getSubcommand<Possible extends string[]>(
    options: any
  ): Possible[number] {
    return options.getSubcommand();
  }
  
  export default getSubcommand;
  