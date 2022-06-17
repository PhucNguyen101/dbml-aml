## Holistics AML Std

Holistics AML Standard definiton for Data Model, Dataset, Relationship

### Version matrix
| holistics-aml-std | @holistics/aml | @holistics/aml-editor |
| ----------------- | -------------- | --------------------- |
| 1.0.0             | 1.6.*          | 1.6.*                 |
| 1.2.0             | 1.7.*          | 1.7.*                 |
| 1.3.0             | 1.7.*, 1.8.0   | 1.7.*                 |
| 1.4.0             | 1.8.1          | 1.7.*                 |
| 2.0.0             | 1.8.1          | 1.7.*                 |

### Usage
```ts
import { Program } from '@holistics/aml';
import { AMLWorker } from '@holistics/aml-editor';
import { 
  loadHolisticsAMLDefinitionToProgram,
  loadHolisticsAMLDefinitionToWorker
} from '@holistics/aml-std';

const program = new Program();
loadHolisticsAMLDefinitionToProgram(program);

const worker = new AMLWorker();
loadHolisticsAMLDefinitionToWorker(worker);

console.log(program.globalSymbolTable) // { Model, TableModel, QueryModel, ... }
```
