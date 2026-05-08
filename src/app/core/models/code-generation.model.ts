export interface GeneratedFile {
  fileName: string;
  content: string;
}

export interface GeneratedFolder {
  folderName: string;
  files: GeneratedFile[];
}