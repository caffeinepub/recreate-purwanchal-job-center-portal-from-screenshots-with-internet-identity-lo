import { useGetPosts } from '../../hooks/queries/usePosts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar } from 'lucide-react';

export default function UpdatesPage() {
  const { data: posts, isLoading } = useGetPosts();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Updates & Announcements</h2>
        <p className="text-gray-600">Stay informed with the latest news</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading updates...</p>
        </div>
      ) : !posts || posts.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No updates yet</h3>
            <p className="text-gray-500">Check back later for announcements</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id.toString()} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-700">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image.getDirectURL()}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
