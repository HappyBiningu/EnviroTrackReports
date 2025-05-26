import { useQuery } from "@tanstack/react-query";

export interface QuarterlyData {
  quarter: string;
  period: string;
  totalReports: number;
  resolved: number;
  pending: number;
  resolutionRate: number;
}

export interface AnnualSummary {
  totalReports: number;
  totalResolved: number;
  resolutionRate: number;
}

export interface CategoryData {
  water: number;
  air: number;
  waste: number;
  noise: number;
  others: number;
}

export interface OrganizationData {
  name: string;
  reportsHandled: number;
  resolutionRate: number;
  avgResponseTime: string;
}

export interface TaskSummary {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface EngagementSummary {
  totalComments: number;
  responsesGiven: number;
  responseRate: number;
  avgResponseTime: number;
}

export interface QuarterlyReportsData {
  quarters: QuarterlyData[];
  annualSummary: AnnualSummary;
  categoryData: CategoryData;
  organizationData: OrganizationData[];
  taskSummary: TaskSummary;
  engagementSummary: EngagementSummary;
  achievements: string[];
  recommendations: string[];
}

export function useQuarterlyReports(year: number = 2024) {
  return useQuery<QuarterlyReportsData>({
    queryKey: ["/api/v1/quarterly-reports", year],
    queryFn: async () => {
      // Fetch quarterly reports from Django backend
      const response = await fetch(`http://127.0.0.1:8000/api/v1/quarterly-reports/?year=${year}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch quarterly reports: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}

export function useQuarterlyChart(year: number = 2024) {
  return useQuery({
    queryKey: ["/api/v1/reports/quarterly/chart", year],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/reports/quarterly/chart/?year=${year}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch chart data: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
