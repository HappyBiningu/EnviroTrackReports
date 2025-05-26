import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuarterlyReports } from "@/hooks/useQuarterlyReports";
import { generateQuarterlyPDF, generateAllQuartersPDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";

const quarterColors = {
  Q1: "bg-green-100 text-green-800",
  Q2: "bg-blue-100 text-blue-800", 
  Q3: "bg-yellow-100 text-yellow-800",
  Q4: "bg-purple-100 text-purple-800",
};

const quarterPeriods = {
  Q1: "Jan - Mar",
  Q2: "Apr - Jun",
  Q3: "Jul - Sep",
  Q4: "Oct - Dec",
};

export default function QuarterlyReports() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { data, isLoading, error } = useQuarterlyReports(selectedYear);
  const { toast } = useToast();

  const handleDownloadQuarterly = async (quarter: string) => {
    if (!data) return;
    
    const quarterData = data.quarters.find(q => q.quarter === quarter);
    if (!quarterData) return;

    try {
      await generateQuarterlyPDF(quarterData, data);
      toast({
        title: "Success",
        description: `${quarter} report downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = async () => {
    if (!data) return;

    try {
      await generateAllQuartersPDF(data.quarters, data);
      toast({
        title: "Success",
        description: "Annual report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to generate annual PDF report",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64">
          <main className="container mx-auto px-6 py-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold">Error Loading Reports</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Failed to fetch quarterly reports. Please check your connection to the backend server.
                  </p>
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Quarterly Reports</h1>
                <p className="text-gray-600 mt-2">
                  Comprehensive environmental management reports organized by quarters
                </p>
              </div>
              <div className="flex gap-3">
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleDownloadAll}
                  disabled={isLoading || !data}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate Annual Report
                </Button>
              </div>
            </div>

            {/* Quarter Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-6">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </Card>
                  ))
                : data?.quarters.map((quarter) => (
                    <Card key={quarter.quarter} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">{quarter.quarter} {selectedYear}</h3>
                        <Badge className={quarterColors[quarter.quarter as keyof typeof quarterColors]}>
                          {quarterPeriods[quarter.quarter as keyof typeof quarterPeriods]}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Reports:</span>
                          <span className="font-semibold">{quarter.totalReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resolved:</span>
                          <span className="font-semibold text-green-600">{quarter.resolved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-semibold text-yellow-600">{quarter.pending}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resolution Rate:</span>
                          <span className="font-semibold text-blue-600">{quarter.resolutionRate}%</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadQuarterly(quarter.quarter)}
                        className="w-full mt-4 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {quarter.quarter} Report
                      </Button>
                    </Card>
                  ))}
            </div>

            {/* Annual Summary */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                    {selectedYear} Annual Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{data.annualSummary.totalReports}</div>
                      <div className="text-gray-600">Total Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{data.annualSummary.totalResolved}</div>
                      <div className="text-gray-600">Total Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{data.annualSummary.resolutionRate}%</div>
                      <div className="text-gray-600">Resolution Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environmental Impact by Category */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Environmental Impact by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <h3 className="font-semibold">Water Issues</h3>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{data.categoryData.water}</div>
                      <div className="text-sm text-gray-600">35% of total reports</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <h3 className="font-semibold">Air Quality</h3>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{data.categoryData.air}</div>
                      <div className="text-sm text-gray-600">25% of total reports</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <h3 className="font-semibold">Waste Management</h3>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">{data.categoryData.waste}</div>
                      <div className="text-sm text-gray-600">20% of total reports</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <h3 className="font-semibold">Noise Pollution</h3>
                      </div>
                      <div className="text-2xl font-bold text-red-600">{data.categoryData.noise}</div>
                      <div className="text-sm text-gray-600">15% of total reports</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <h3 className="font-semibold">Others</h3>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{data.categoryData.others}</div>
                      <div className="text-sm text-gray-600">5% of total reports</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organizational Performance */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Organizational Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-3 font-semibold">Organization</th>
                          <th className="pb-3 font-semibold">Reports Handled</th>
                          <th className="pb-3 font-semibold">Resolution Rate</th>
                          <th className="pb-3 font-semibold">Avg. Response Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.organizationData.map((org, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3">{org.name}</td>
                            <td className="py-3">{org.reportsHandled}</td>
                            <td className="py-3">
                              <span className="text-green-600 font-semibold">{org.resolutionRate}%</span>
                            </td>
                            <td className="py-3">{org.avgResponseTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Management Summary */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" />
                    Task Management Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">{data.taskSummary.pending}</div>
                      <div className="text-gray-600">Pending Tasks</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {Math.round((data.taskSummary.pending / data.taskSummary.total) * 100)}% of total
                      </div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{data.taskSummary.inProgress}</div>
                      <div className="text-gray-600">In Progress</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {Math.round((data.taskSummary.inProgress / data.taskSummary.total) * 100)}% of total
                      </div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{data.taskSummary.completed}</div>
                      <div className="text-gray-600">Completed</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {Math.round((data.taskSummary.completed / data.taskSummary.total) * 100)}% of total
                      </div>
                    </div>
                    <div className="text-center border border-gray-200 rounded-lg p-4">
                      <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-600">{data.taskSummary.total}</div>
                      <div className="text-gray-600">Total Tasks</div>
                      <div className="text-sm text-gray-500 mt-1">100%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Community Engagement Summary */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Community Engagement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{data.engagementSummary.totalComments}</div>
                      <div className="text-gray-600">Total Comments</div>
                      <div className="text-sm text-gray-500 mt-1">+18% from last year</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{data.engagementSummary.responsesGiven}</div>
                      <div className="text-gray-600">Responses Given</div>
                      <div className="text-sm text-gray-500 mt-1">{data.engagementSummary.responseRate}% response rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{data.engagementSummary.avgResponseTime}</div>
                      <div className="text-gray-600">Avg. Response Time (days)</div>
                      <div className="text-sm text-gray-500 mt-1">-0.8 days improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Achievements and Recommendations */}
            {data && (
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-xl">Key Achievements & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4">Achievements</h3>
                      <ul className="space-y-2">
                        {data.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {data.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
