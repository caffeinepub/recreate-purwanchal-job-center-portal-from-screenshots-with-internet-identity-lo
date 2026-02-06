import { useState } from 'react';
import { useGetJobVacancies } from '../../hooks/queries/useJobs';
import {
  useCreateJobVacancy,
  useUpdateJobVacancy,
  useDeleteJobVacancy,
} from '../../hooks/queries/useAdminMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Briefcase, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { JobVacancy } from '../../backend';

export default function VacanciesAdminPage() {
  const { data: jobs, isLoading } = useGetJobVacancies();
  const { mutate: createJob, isPending: creating, error: createError } = useCreateJobVacancy();
  const { mutate: updateJob, isPending: updating, error: updateError } = useUpdateJobVacancy();
  const { mutate: deleteJob, error: deleteError } = useDeleteJobVacancy();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobVacancy | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [requirements, setRequirements] = useState('');

  const mutationError = createError || updateError || deleteError;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSalaryRange('');
    setRequirements('');
    setEditingJob(null);
  };

  const handleOpenDialog = (job?: JobVacancy) => {
    if (job) {
      setEditingJob(job);
      setTitle(job.title);
      setDescription(job.description);
      setSalaryRange(job.salaryRange);
      setRequirements(job.requirements.join('\n'));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reqArray = requirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const jobData: JobVacancy = {
      id: editingJob?.id || BigInt(0),
      title,
      description,
      salaryRange,
      requirements: reqArray,
      postedAt: editingJob?.postedAt || BigInt(0),
    };

    if (editingJob) {
      updateJob(
        { jobId: editingJob.id, vacancy: jobData },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
        }
      );
    } else {
      createJob(jobData, {
        onSuccess: () => {
          handleCloseDialog();
        },
      });
    }
  };

  const handleDelete = (jobId: bigint) => {
    if (confirm('Are you sure you want to delete this job vacancy?')) {
      deleteJob(jobId);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Manage Job Vacancies</h2>
          <p className="text-gray-600">Create, edit, and delete job postings</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-5 h-5" />
          Add Vacancy
        </Button>
      </div>

      {mutationError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {mutationError instanceof Error ? mutationError.message : 'An error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vacancies...</p>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No vacancies yet</h3>
            <p className="text-gray-500">Create your first job posting</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id.toString()} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-blue-700">{job.title}</CardTitle>
                    <CardDescription>Posted {formatDate(job.postedAt)} • {job.salaryRange}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleOpenDialog(job)} variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(job.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{job.description}</p>
                {job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Vacancy' : 'Create Job Vacancy'}</DialogTitle>
            <DialogDescription>
              {editingJob ? 'Update the job vacancy details' : 'Add a new job posting'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                placeholder="Describe the job role and responsibilities..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range *</Label>
              <Input
                id="salaryRange"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                required
                placeholder="e.g., NPR 30,000 - 50,000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={6}
                placeholder="Bachelor's degree in Computer Science&#10;2+ years of experience&#10;Strong communication skills"
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={creating || updating} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {creating || updating ? 'Saving...' : editingJob ? 'Update Vacancy' : 'Create Vacancy'}
              </Button>
              <Button type="button" onClick={handleCloseDialog} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
