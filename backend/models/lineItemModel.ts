export interface LineItem {
  id: number;
  partNumber: string;
  description: string;
  status?: string | null;
  reason?: string | null;
  photo?: string | null;
}
