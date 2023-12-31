export interface IEvent {
  _id: string;
  recurringEventId?: string;
  title: string;
  description?: string;
  notes?: string;
  startDate: Date; 
  endDate?: Date;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  repeatCycle?: "none" | "daily" | "biweekly" | "weekly" | "monthly" | "yearly";
}
