import { Component, inject, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Tasks } from "../../../../core/models/tasks-model";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from '@angular/material/tabs';
import { LucideGitPullRequest } from '@lucide/angular';
import { MatSnackBar } from "@angular/material/snack-bar";
import { GeneratedFile, GeneratedFolder } from "../../../../core/models/code-generation.model";
import * as Prism from 'prismjs';
import { HighlightPipe } from "../../../../shared/pipes/prism.pipe";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PullRequestsService } from "../../../../core/services/pullrequests.service";
import { TasksService } from "../../../../core/services/tasks.service";

@Component({
  standalone: true,
  selector: "app-code-generation",
  templateUrl: "generate-code-dialog.component.html",
  styleUrl: "generate-code-dialog.component.css",
  imports: [CommonModule, MatDialogModule, MatStepperModule, MatButtonModule, MatTabsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    MatIconModule, LucideGitPullRequest],
  providers: [HighlightPipe]

})
export class CodeGenerationDialogComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  generateCodeForm!: FormGroup;
  codeGenerationService = inject(TasksService);
  prService = inject(PullRequestsService);
  matSnackBar = inject(MatSnackBar);
  private highlightPipe = inject(HighlightPipe);
  generatedFolder: GeneratedFolder | null = null;
  selectedFile: GeneratedFile | null = null;
  highlightedCode: string = '';
  isGenerating = false;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<CodeGenerationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Tasks }
  ) { }
  processCodeLocally(content: string, fileName: string) {
    const highlightedHtml = this.highlightPipe.transform(content, fileName);
    console.log('Highlighted Result:', highlightedHtml);
    return highlightedHtml;
  }
  ngOnInit(): void {
    this.generateCodeForm = this.fb.group({
      description: [this.data.task.description]

    });
  }
  onSendPrompt() {
    if (this.isGenerating) return;

    this.isGenerating = true;

    this.codeGenerationService
      .sendPrompt(this.generateCodeForm.get('description')?.value)
      .subscribe({
        next: (generatedFolder) => {
          this.generatedFolder = generatedFolder;

          if (generatedFolder.files?.length) {
            this.selectFile(generatedFolder.files[0]);
          }

          this.isGenerating = false;
          this.stepper.next();

          setTimeout(() => Prism.highlightAll());
        },
        error: () => {
          this.isGenerating = false;
          this.matSnackBar.open('Failed to generate code', 'Close');
        }
      });
  }

  copyCode(code: string, fileName: string) {
    const formattedText = this.highlightPipe.getFormattedCode(code, fileName);
    navigator.clipboard.writeText(formattedText);
  }
  // Add this getter to your class
  get allGeneratedFiles(): GeneratedFile[] {
    return this.generatedFolder?.files || [];
  }

  // Ensure downloadZip handles the array correctly
  async downloadZip(files: GeneratedFile[]) {
    if (!files || files.length === 0) {
      this.matSnackBar.open('No files to download', 'Close', { duration: 3000 });
      return;
    }

    const zip = new JSZip();

    files.forEach(file => {
      // We use the 'getFormattedCode' method to ensure the physical file 
      // in the ZIP has newlines and correct C# indentation.
      const formattedContent = this.highlightPipe.getFormattedCode(file.content, file.fileName);
      zip.file(file.fileName, formattedContent);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${this.generatedFolder?.folderName || 'GeneratedCode'}.zip`);
  }

  selectFile(file: GeneratedFile) {
    this.selectedFile = file;
    this.highlightedCode = this.highlightPipe.transform(file.content, file.fileName);
  }
  getLanguage(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
      'cs': 'csharp',
      'ts': 'typescript',
      'js': 'javascript',
      'json': 'json'
    };
    return map[ext] || 'clike';
  }
  onCreatePullRequest() {
    if (!this.generatedFolder) return;

    this.isGenerating = true;

    const payload = {
      projectId: this.data.task.projectId,
      taskId: this.data.task.taskId,
      rootFolder: this.generatedFolder.folderName, // e.g., "ProductModule"
      files: this.generatedFolder.files.map(f => ({
        fileName: f.fileName,
        content: this.highlightPipe.getFormattedCode(f.content, f.fileName)
      }))
    };

    this.prService.createPullRequest(payload).subscribe({
      next: (res) => {
        this.isGenerating = false;
        this.matSnackBar.open('PR Created!', 'View').onAction().subscribe(() => {
          window.open(res.prUrl, '_blank');
        });
      },
      error: () => {
        this.isGenerating = false;
        this.matSnackBar.open('Localization failed: File not found in repo', 'Close');
      }
    });
  }
}