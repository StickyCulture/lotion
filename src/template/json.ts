import fs from 'fs'

export const useJsonTemplate = (data: any, filePath: string) => {
   fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
