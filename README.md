# ts-transformer-replace-paths

[![npm](https://img.shields.io/npm/v/ts-transformer-replace-paths.svg)](https://www.npmjs.com/package/ts-transformer-replace-paths)

TypeScript custom transformer that replaces import paths with regular expressions

`tsconfig.json`:
```json
{
    "compilerOptions": {
        "plugins": [
            {
                "transform": "ts-transformer-replace-paths",
                "replaceImportPaths": {
                    "^foo/esm/(.+)": "foo/cjs/$1",
                    "^bar$": "buzz"
                }
            }
        ]
    }
}
```

Input:
```ts
import * as foo from 'foo/esm/index';
import { bar } from "bar";
import 'asd';

foo;
bar;
```

Output:
```js
import * as foo from 'foo/cjs/index';
import { bar } from "buzz";
import 'asd';
foo;
bar;
```
