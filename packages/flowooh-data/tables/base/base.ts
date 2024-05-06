export interface BaseData {
  id: string;

  created_at: Date;
  created_by: string;

  updated_at: Date;
  updated_by: string;

  removed_at: Date;
  removed_by: string;

  __version__: number;
}
