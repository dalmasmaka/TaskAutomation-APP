import { Component, Inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatStepperModule } from "@angular/material/stepper";
import { Tasks } from "../../../../core/models/tasks-model";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from '@angular/material/tabs';
import { LucideGitPullRequest } from '@lucide/angular';


@Component({
    standalone: true,
    selector: "app-code-generation",
    templateUrl: "generate-code-dialog.component.html",
    styleUrl: "generate-code-dialog.component.css",
    imports: [CommonModule, MatDialogModule, MatStepperModule, MatButtonModule, MatTabsModule,  MatFormFieldModule, ReactiveFormsModule, MatInputModule,
         MatIconModule, LucideGitPullRequest]

})
export class CodeGenerationDialogComponent{
    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<CodeGenerationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task: Tasks }
    ) { }
     selectedTab = 0;

  backendCode = `// Example .NET Controller
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok();
    }
}`;

  frontendCode = `// Angular Service Example
@Injectable()
export class UserService {
  getUsers() {
    return this.http.get('/api/users');
  }
}`;

  files = [
    { path: 'Backend/Controllers/UserController.cs', content: this.backendCode },
    { path: 'Frontend/services/user.service.ts', content: this.frontendCode }
  ];

  selectedFile: any = null;

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  selectFile(file: any) {
    this.selectedFile = file;
  }

  downloadZip() {
    console.log('Download ZIP triggered');
    // connect to backend endpoint
  }

  regenerate() {
    console.log('Regenerate triggered');
    // call AI again
  }
}