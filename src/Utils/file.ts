export function removeExtension(fileName: string, extension = '.ts') {
  return fileName.slice(0, fileName.indexOf(extension))
}
