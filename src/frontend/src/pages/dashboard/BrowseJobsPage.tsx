import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetJobVacancies, useSearchJobVacancies } from '../../hooks/queries/useJobs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Briefcase, Calendar, DollarSign } from 'lucide-react';

export default function BrowseJobsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: allJobs, isLoading: allJobsLoading } = useGetJobVacancies();
  const { data: searchResults, isLoading: searchLoading } = useSearchJobVacancies(
    isSearching ? searchTerm || null : null
  );

  const jobs = isSearching ? searchResults : allJobs;
  const isLoading = isSearching ? searchLoading : allJobsLoading;

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Browse Job Opportunities</h2>
        <p className="text-gray-600">Explore available positions and apply</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8 shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
            {isSearching && (
              <Button onClick={handleClearSearch} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available at the moment</h3>
            <p className="text-gray-500">Check back later for new opportunities</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card
              key={job.id.toString()}
              className="shadow-md hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-l-blue-600"
              onClick={() => navigate({ to: `/dashboard/job/${job.id.toString()}` })}
            >
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">{job.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Posted {formatDate(job.postedAt)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {job.salaryRange}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-2 mb-4">{job.description}</p>
                {job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
