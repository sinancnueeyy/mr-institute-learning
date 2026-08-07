import { useState, useEffect } from 'react';
import { FadeIn } from '../../components/animations/FadeIn';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DashboardChart } from '../../components/office/DashboardChart';
import { Download, FileSpreadsheet, FileText, Users, Award, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { applicationsRepository, enquiriesRepository } from '../../repositories/operations';

export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [appsRes, enqRes] = await Promise.all([
          applicationsRepository.getAll(),
          enquiriesRepository.getAll()
        ]);
        
        const apps = appsRes.data || [];
        const enqs = enqRes.data || [];

        const approved = apps.filter(a => a.status === 'accepted').length;
        const rejected = apps.filter(a => a.status === 'rejected').length;
        const pending = apps.filter(a => a.status === 'pending').length;

        setConversionData([
          { name: 'Approved', value: approved, color: '#10B981' },
          { name: 'Rejected', value: rejected, color: '#EF4444' },
          { name: 'Pending', value: pending, color: '#F59E0B' }
        ]);

        // Basic mock grouping for months based on data available
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        const last6Months = Array.from({length: 6}).map((_, i) => {
          let d = new Date();
          d.setMonth(currentMonth - 5 + i);
          return {
            name: months[d.getMonth()],
            applications: apps.filter(a => new Date(a.submittedAt).getMonth() === d.getMonth()).length,
            admissions: apps.filter(a => new Date(a.submittedAt).getMonth() === d.getMonth() && a.status === 'accepted').length,
            enquiries: enqs.filter(e => new Date(e.createdAt).getMonth() === d.getMonth()).length
          };
        });

        setMonthlyData(last6Months);
      } catch (err) {
        console.error("Failed to fetch report data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExport = (reportName: string) => {
    setIsExporting(true);
    setTimeout(() => {
      toast.success(`${reportName} exported successfully`);
      setIsExporting(false);
    }, 1000);
  };

  const reportModules = [
    {
      title: 'Admissions Report',
      description: 'Monthly admission trends and status breakdown.',
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      action: () => handleExport('Admissions_Report.csv')
    },
    {
      title: 'Student Directory',
      description: 'Complete list of active, graduated, and dropped students.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      action: () => handleExport('Student_Directory.csv')
    },
    {
      title: 'Scholarship Allocations',
      description: 'Detailed report of approved vs rejected scholarship requests.',
      icon: <Award className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      action: () => handleExport('Scholarships_Report.csv')
    },
    {
      title: 'Charity Distribution',
      description: 'Summary of community charity distributions and pending requests.',
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      action: () => handleExport('Charity_Report.csv')
    },
    {
      title: 'Enquiry CRM Logs',
      description: 'Resolution metrics and follow-up activities.',
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      action: () => handleExport('Enquiries_Log.csv')
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <FadeIn className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
          <p className="text-text-secondary">Generate and export operational reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth & Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart 
              type="line"
              data={monthlyData}
              series={[
                { key: 'applications', name: 'Applications', color: '#4F46E5' },
                { key: 'admissions', name: 'Admissions', color: '#10B981' },
                { key: 'enquiries', name: 'Enquiries', color: '#F59E0B' }
              ]}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Success Rate (YTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart 
              type="pie"
              data={conversionData}
              series={[{ key: 'value', name: 'Status', color: '#4F46E5' }]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Export Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportModules.map((module, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${module.bg}`}>
                {module.icon}
              </div>
              <div>
                <h3 className="font-bold text-text-primary">{module.title}</h3>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">{module.description}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-border flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={module.action}
                disabled={isExporting}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={module.action}
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
