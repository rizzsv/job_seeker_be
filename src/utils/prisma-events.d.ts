export interface PrismaQueryEvent {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
}

export interface PrismaLogEvent {
  timestamp: Date;
  message: string;
  target: string;
}
