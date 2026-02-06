import { useState } from 'react';
import { useGetPosts } from '../../hooks/queries/usePosts';
import { useCreatePost, useUpdatePost, useDeletePost } from '../../hooks/queries/useAdminMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, Upload, X } from 'lucide-react';
import type { Post } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function PostsAdminPage() {
  const { data: posts, isLoading } = useGetPosts();
  const { mutate: createPost, isPending: creating } = useCreatePost();
  const { mutate: updatePost, isPending: updating } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImageFile(null);
    setRemoveImage(false);
    setUploadProgress(0);
    setEditingPost(null);
  };

  const handleOpenDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setRemoveImage(false);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageBlob: ExternalBlob | null = null;

    if (removeImage) {
      imageBlob = null;
    } else if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    } else if (editingPost?.image) {
      imageBlob = editingPost.image;
    }

    if (editingPost) {
      updatePost(
        { postId: editingPost.id, title, content, image: imageBlob },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
        }
      );
    } else {
      createPost(
        { title, content, image: imageBlob },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
        }
      );
    }
  };

  const handleDelete = (postId: bigint) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Manage Posts & Updates</h2>
          <p className="text-gray-600">Create, edit, and delete announcements</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-5 h-5" />
          Add Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : !posts || posts.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500">Create your first announcement</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id.toString()} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-blue-700">{post.title}</CardTitle>
                    <CardDescription>{formatDate(post.createdAt)}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleOpenDialog(post)} variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id)}
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
              <CardContent className="space-y-4">
                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img src={post.image.getDirectURL()} alt={post.title} className="w-full h-48 object-cover" />
                  </div>
                )}
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the post details' : 'Add a new announcement'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., New Job Opportunities Available"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                placeholder="Write your announcement here..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (Optional, max 2MB)</Label>
              {editingPost?.image && !removeImage && !imageFile && (
                <div className="mb-2 relative">
                  <img
                    src={editingPost.image.getDirectURL()}
                    alt="Current"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={() => setRemoveImage(true)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 gap-1"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              )}
              {removeImage && <p className="text-sm text-red-600">Image will be removed on save</p>}
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] || null);
                    setRemoveImage(false);
                  }}
                  className="cursor-pointer"
                />
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              {imageFile && <p className="text-sm text-gray-600">Selected: {imageFile.name}</p>}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={creating || updating} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {creating || updating ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
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
