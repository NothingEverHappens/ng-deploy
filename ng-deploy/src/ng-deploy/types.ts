export interface Project {
  name: string;
  id: string;
  permission: 'edit' | 'view' | 'own';
}

export interface FirebaseDeployConfig {
  cwd: string;
}

export interface FirebaseTools {
  login(): Promise<void>;
  list(): Promise<Project[]>;
  deploy(config: FirebaseDeployConfig): Promise<any>;
}