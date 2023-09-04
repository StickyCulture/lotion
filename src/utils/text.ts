export const sanitizeText = (text: string) => {
   // remove all non-alphanumeric characters with '_'
   return text.replace(/[^a-z0-9]/gi, '_')
}
