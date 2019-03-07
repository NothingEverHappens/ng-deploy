export interface Project {
  name: string;
  id: string;
  permission: 'edit' | 'view' | 'own';
}
