import { NgModule } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';

const MATERIALS = [MatDialogModule];

@NgModule({
  imports: MATERIALS,
  exports: MATERIALS,
})
export class MaterialModule {}
