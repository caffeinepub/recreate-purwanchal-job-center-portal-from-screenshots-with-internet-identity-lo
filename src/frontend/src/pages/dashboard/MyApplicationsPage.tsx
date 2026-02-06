import { useGetMyApplications } from '../../hooks/queries/useApplications';
import { useGetJobVacancies } from '../../hooks/queries/useJobs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Briefcase } from 'lucide-react';

export default function MyApplicationsPage() {
  const { data: applications, isLoading: appsLoading } = useGetMyApplications();
  const { data: jobs } = useGetJobVacancies();

  const getJobTitle = (jobId: bigint) => {
    const job = jobs?.find((j) => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">My Applications</h2>
        <p className="text-gray-600">Track your job applications</p>
      </div>

      {appsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      ) : !applications || applications.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
            <p className="text-gray-500">Start applying to jobs to see your applications here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app.id.toString()} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {getJobTitle(app.jobId)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4" />
                      Applied {formatDate(app.appliedAt)}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(app.status)} border`}>{getStatusLabel(app.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Cover Letter</h4>
                    <p className="text-gray-600 text-sm line-clamp-3">{app.coverLetter}</p>
                  </div>
                  {app.resume && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Resume</h4>
                      <a
                        href={app.resume.getDirectURL()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Resume
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
