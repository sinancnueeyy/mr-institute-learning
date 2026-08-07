import { useState, useEffect } from 'react';
import { FadeIn } from '../../components/animations/FadeIn';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { FilterPanel } from '../../components/office/FilterPanel';
import { StatusBadge, type StatusType } from '../../components/office/StatusBadge';
import { ExportDialog } from '../../components/office/ExportDialog';
import { studentsRepository } from '../../repositories/operations';
import type { Student } from '../../types/operations';
import { Eye, Edit, Download, GraduationCap, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StudentDirectory() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentsRepository.getAll();
      setStudents(res.data || []);
    } catch (error) {
      console.error("Error fetching students", error);
      toast.error('Failed to load student directory');
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (rawStatus: string): StatusType => {
    const map: Record<string, string> = {
      'active': 'Verified',
      'graduated': 'Approved',
      'dropped': 'Rejected'
    };
    return map[rawStatus] || rawStatus;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      accessorKey: 'name', 
      header: 'Student Name',
      cell: (item: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-text-primary">{item.name}</p>
            <p className="text-xs text-text-muted">{item.email}</p>
          </div>
        </div>
      )
    },
    { 
      accessorKey: 'id', 
      header: 'Student ID',
      cell: (item: Student) => <span className="font-mono text-sm">{item.id}</span>
    },
    { 
      accessorKey: 'enrollmentDate', 
      header: 'Enrolled',
      cell: (item: Student) => <span className="text-sm">{new Date(item.enrollmentDate).toLocaleDateString()}</span>
    },
    { 
      accessorKey: 'status', 
      header: 'Status',
      cell: (item: Student) => <StatusBadge status={mapStatus(item.status)} />
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (item: Student) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSelectedStudent(item); setIsDrawerOpen(true); }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <FadeIn className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Student Directory</h1>
          <p className="text-text-secondary">Manage and view all enrolled students.</p>
        </div>
        <Button variant="outline" onClick={() => setIsExportOpen(true)}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <FilterPanel 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchPlaceholder="Search by name, ID, or email..."
        statusOptions={[
          { label: 'All Students', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Graduated', value: 'graduated' },
          { label: 'Dropped', value: 'dropped' }
        ]}
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <DataTable 
          data={filteredStudents}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyMessage="No students found matching your criteria."
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Student Profile"
      >
        {selectedStudent && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl shrink-0">
                {selectedStudent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{selectedStudent.name}</h2>
                <p className="text-text-secondary font-mono text-sm mb-1">{selectedStudent.id}</p>
                <StatusBadge status={mapStatus(selectedStudent.status)} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <span className="text-sm">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <span className="text-sm">{selectedStudent.phone}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-text-primary border-b border-border pb-2 mb-4">Enrolled Courses</h3>
                {selectedStudent.courseIds?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStudent.courseIds.map((courseId: string) => (
                      <div key={courseId} className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg">
                        <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm truncate">{courseId}</p>
                          <p className="text-xs text-success font-medium mt-0.5">Enrolled</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted italic">No courses currently enrolled.</p>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border flex gap-3">
               <Button variant="outline" className="flex-1">
                 Edit Profile
               </Button>
               <Button variant="outline" className="flex-1 text-error hover:bg-error/10 hover:border-error">
                 Update Status
               </Button>
            </div>
          </div>
        )}
      </Drawer>

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExportCSV={() => toast.success('Exporting CSV...')}
        onPrint={() => window.print()}
      />
    </FadeIn>
  );
}
