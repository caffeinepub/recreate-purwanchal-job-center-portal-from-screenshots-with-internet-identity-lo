import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetJobVacancy } from '../../hooks/queries/useJobs';
import { useApplyForJob } from '../../hooks/queries/useApplications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, DollarSign, CheckCircle, Upload } from 'lucide-react';
import { ExternalBlob } from '../../backend';

export default function JobDetailPage() {
  const navigate = useNavigate();
  const { jobId } = useParams({ from: '/dashboard/job/$jobId' });
  const { data: job, isLoading } = useGetJobVacancy(BigInt(jobId));
  const { mutate: applyForJob, isPending } = useApplyForJob();

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    let resumeBlob: ExternalBlob | null = null;

    if (resumeFile) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      resumeBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    }

    applyForJob(
      {
        jobId: BigInt(jobId),
        coverLetter,
        resume: resumeBlob,
      },
      {
        onSuccess: () => {
          setApplied(true);
          setCoverLetter('');
          setResumeFile(null);
          setUploadProgress(0);
        },
      }
    );
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <Card className="shadow-md">
        <CardContent className="py-16 text-center">
          <p className="text-gray-600">Job not found</p>
          <Button onClick={() => navigate({ to: '/dashboard' })} className="mt-4">
            Back to Jobs
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Button onClick={() => navigate({ to: '/dashboard' })} variant="ghost" className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-l-4 border-l-blue-600">
            <CardHeader>
              <CardTitle className="text-3xl text-blue-700">{job.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-4 mt-3 text-base">
                <span className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  Posted {formatDate(job.postedAt)}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-5 h-5" />
                  {job.salaryRange}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <div>
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Apply for this Position</CardTitle>
              <CardDescription>Submit your application</CardDescription>
            </CardHeader>
            <CardContent>
              {applied ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-4">Your application has been sent successfully.</p>
                  <Button onClick={() => navigate({ to: '/dashboard/applications' })} className="w-full">
                    View My Applications
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                      rows={6}
                      placeholder="Tell us why you're a great fit for this position..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    {resumeFile && <p className="text-sm text-gray-600">Selected: {resumeFile.name}</p>}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
