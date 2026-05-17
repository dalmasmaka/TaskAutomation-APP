export interface DashboardInsights {
    projects: InsightItem;
    tasks: InsightItem;
    pullRequests: InsightItem;
    members: InsightItem;
}

export interface InsightItem {
    total: number;
    breakdown: InsightBreakdown[];
}

export interface InsightBreakdown {
    key: string;
    count: number;
    percentage: number;
}
export enum TimeRange {
  Day = 0,
  Week = 1,
  Month = 2
}

export interface UserWorkload {
  fullName: string;
  taskCount: number;
  loadPercentage: number;
}


export interface WorkloadInsights {
  peakDistribution: UserWorkload[];
  availableBandwidth: UserWorkload[];
}
export interface UserPRSuccess {
  fullName: string;
  approvedCount: number;
}

export interface PREngagement {
  totalPRs: number;
  totalApproved: number;
  totalCommented: number;
  totalRequestChanges: number;
  successRate: number;
  topPerformers: UserPRSuccess[];
}