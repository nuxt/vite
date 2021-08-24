import { join } from 'upath'
import fsExtra from 'fs-extra'

export const wpfs: any = {
  ...fsExtra,
  join
}
