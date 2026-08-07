import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../../components/animations/FadeIn';
import { StatCard } from '../../components/office/StatCard';
import { DashboardChart } from '../../components/office/DashboardChart';
import { RecentActivityCard } from '../../components/office/RecentActivityCard';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants';
import { FileText, Users, Heart, MessageSquare, Award, Clock } from 'lucide-react';
import { 
  applicationsRepository, 
  studentsRepository, 
  scholarshipsRepository, 
  charityRepository, 
  enquiriesRepository 
} from '../../repositories/operations';

export default function OfficeDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAdmissions: 0,
    pendingAdmissions: 0,
    approvedAdmissions: 0,
    rejectedApplications: 0,
    totalStudents: 0,
    scholarshipRequests: 0,
    charityRequests: 0,
    newEnquiries: 0,
    todaysApplications: 0
  });

  const [charts, setCharts] = useState({
    admissionsStatus: [] as any[],
    monthlyAdmissions: [] as any[],
  });

  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apps, studs, schols, chars, enqs] = await Promise.all([
          applicationsRepository.getAll(),
          studentsRepository.getAll(),
          scholarshipsRepository.getAll(),
          charityRepository.getAll(),
          enquiriesRepository.getAll()
        ]);

        const applications = apps.data || [];
        const pendingApps = applications.filter((a: any) => a.status === 'pending').length;
        const approvedApps = applications.filter((a: any) => a.status === 'accepted').length;
        const rejectedApps = applications.filter((a: any) => a.status === 'rejected').length;
        const todayApps = applications.filter((a: any) => {
          const today = new Date();
          const appDate = new Date(a.submittedAt);
          return appDate.toDateString() === today.toDateString();
        }).length;

        const newEnqs = (enqs.data || []).filter((e: any) => e.status === 'new').length;
        const totalStudents = (studs.data || []).filter((a: any) => a.status === 'active').length;
        const scholReqs = (schols.data || []).length;
        const charReqs = (chars.data || []).length;

        setStats({
          totalAdmissions: applications.length,
          pendingAdmissions: pendingApps,
          approvedAdmissions: approvedApps,
          rejectedApplications: rejectedApps,
          totalStudents,
          scholarshipRequests: scholReqs,
          charityRequests: charReqs,
          newEnquiries: newEnqs,
          todaysApplications: todayApps
        });

        setCharts({
          admissionsStatus: [
            { name: 'Pending', value: pendingApps, color: '#F59E0B' },
            { name: 'Approved', value: approvedApps, color: '#10B981' },
            { name: 'Rejected', value: rejectedApps, color: '#EF4444' }
          ],
          monthlyAdmissions: Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - 5 + i);
            return {
              name: d.toLocaleString('default', { month: 'short' }),
              count: applications.filter((a: any) => new Date(a.submittedAt).getMonth() === d.getMonth()).length
            };
          })
        });

        // Recent activity based on apps
        const recentApps = [...applications].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5);
        setActivities(recentApps.map((a: any) => ({
          id: a.id,
          title: `New Admission Application: ${a.applicantName}`,
          date: a.submittedAt,
          status: 'current',
          icon: 'user'
        })));

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <h1 className="text-2xl font-bold text-text-primary">Office Dashboard</h1>
          <p className="text-text-secondary">Overview of institute operations and pending tasks.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link to={ROUTES.OFFICE.APPLICATIONS}>Review Admissions</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.OFFICE.ENQUIRIES}>Open Enquiries</Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Admissions" value={stats.totalAdmissions} icon={<FileText />} trend={{ value: 12, label: 'vs last month', isPositive: true }} />
        <StatCard title="Pending Review" value={stats.pendingAdmissions} icon={<Clock />} className="border-warning/30 bg-warning/5" />
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} />
        <StatCard title="New Enquiries" value={stats.newEnquiries} icon={<MessageSquare />} trend={{ value: 5, label: 'today', isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Admissions Overview (Monthly)</h3>
            <DashboardChart 
              type="bar" 
              data={charts.monthlyAdmissions} 
              series={[{ key: 'count', name: 'Applications', color: '#4F46E5' }]} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold mb-4">Application Status</h3>
              <DashboardChart 
                type="pie" 
                data={charts.admissionsStatus} 
                series={[{ key: 'value', name: 'Status', color: '#4F46E5' }]} 
                height={250}
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary">Scholarship Requests</h4>
                  <p className="text-2xl font-bold mt-1">{stats.scholarshipRequests}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary">Charity Requests</h4>
                  <p className="text-2xl font-bold mt-1">{stats.charityRequests}</p>
                </div>
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
          <RecentActivityCard 
            title="Recent Applications" 
            activities={activities}
            viewAllLink={ROUTES.OFFICE.APPLICATIONS}
          />
        </div>
      </div>
    </FadeIn>
  );
}
