export interface LineItem {
  id: number;
  partNumber: string;
  description: string;
  /** Optional position of the inspected part e.g. "Left Front" */
  position?: string | null;
  status?: string | null;
  reason?: string | null;
  photo?: string | null;
}
