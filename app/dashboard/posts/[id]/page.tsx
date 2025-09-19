// 'use client';

// import { useFetch } from '@/hook/useFetch';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Bookmark, BookmarkCheck, Calendar, Share2, User } from 'lucide-react';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { Card } from '../../components/PostCard';
// import { LoadingSpinner } from '../../Components/Loading';
// import NotFound from '../../Pages/NotFound';

// interface Post {
//   id: number;
//   title: string;
//   body: string;
//   userId: number;
// }

// export default function PostDetailPage() {
//   const { id } = useParams();
//   const [bookmarks, setBookmarks] = useState<number[]>([]);

//   const {
//     data: post,
//     loading,
//     error,
//   } = useFetch<Post>(id ? `https://jsonplaceholder.typicode.com/posts/${id}` : '');

//   // Related posts fetch (same userId)
//   const { data: relatedPosts } = useFetch<Post[]>(
//     post ? `https://jsonplaceholder.typicode.com/users/${post.userId}/posts` : ''
//   );

//   useEffect(() => {
//     const saved = localStorage.getItem('bookmarks');
//     if (saved) {
//       setBookmarks(JSON.parse(saved));
//     }
//   }, []);

//   const toggleBookmark = (postId: number) => {
//     let updated: number[];
//     if (bookmarks.includes(postId)) {
//       updated = bookmarks.filter((id) => id !== postId);
//     } else {
//       updated = [...bookmarks, postId];
//     }
//     setBookmarks(updated);
//     localStorage.setItem('bookmarks', JSON.stringify(updated));
//   };

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: post?.title,
//           text: post?.body,
//           url: window.location.href,
//         });
//       } catch (err) {
//         console.error('Share failed:', err);
//       }
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
//   if (!post) return <NotFound />;

//   return (
//     <div className="flex justify-center px-4">
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: -20 }}
//         transition={{ duration: 0.3 }}
//         className="space-y-6 max-w-4xl w-full"
//       >
//         {/* Back Button */}
//         <Link
//           href="/posts"
//           className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
//         >
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           Back to Posts
//         </Link>

//         {/* Post Content */}
//         <Card className="w-full">
//           <article className="space-y-6 p-8">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
//                   <span className="text-lg font-bold text-white">{post.id}</span>
//                 </div>
//                 <h1 className="text-3xl font-bold capitalize leading-tight">{post.title}</h1>
//               </div>

//               <div className="flex items-center justify-between py-4 border-t border-b border-card-border">
//                 <div className="flex items-center gap-6">
//                   <div className="flex items-center gap-2 text-sm text-foreground-muted">
//                     <User className="w-4 h-4" /> User {post.userId}
//                   </div>
//                   <div className="flex items-center gap-2 text-sm text-foreground-muted">
//                     <Calendar className="w-4 h-4" /> September 18, 2025
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleShare}
//                     className="p-2 hover:bg-secondary rounded-lg transition-colors"
//                   >
//                     <Share2 className="w-4 h-4" />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => toggleBookmark(post.id)}
//                     className={`p-2 rounded-lg transition-colors ${
//                       bookmarks.includes(post.id) ? 'bg-primary text-white' : 'hover:bg-secondary'
//                     }`}
//                   >
//                     {bookmarks.includes(post.id) ? (
//                       <BookmarkCheck className="w-4 h-4" />
//                     ) : (
//                       <Bookmark className="w-4 h-4" />
//                     )}
//                   </motion.button>
//                 </div>
//               </div>
//             </div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-lg leading-relaxed text-foreground-muted"
//             >
//               {post.body}
//             </motion.div>
//           </article>
//         </Card>

//         {/* Related Posts */}
//         {relatedPosts && relatedPosts.length > 1 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="w-full"
//           >
//             <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {relatedPosts
//                 .filter((p) => p.id !== post.id) // exclude current post
//                 .slice(0, 4) // show max 4
//                 .map((related) => (
//                   <Link key={related.id} href={`/posts/${related.id}`}>
//                     <Card className="group cursor-pointer hover:shadow-md p-4">
//                       <h4 className="font-medium group-hover:text-primary transition-colors">
//                         {related.title}
//                       </h4>
//                       <p className="text-sm text-foreground-muted text-justify line-clamp-2">{related.body}</p>
//                       <div className="flex items-center gap-2 text-xs text-foreground-muted mt-2">
//                         <Calendar className="w-3 h-3" />
//                         Same author
//                       </div>
//                     </Card>
//                   </Link>
//                 ))}
//             </div>
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }

'use client';

import { useFetch } from '@/app/hook/useFetch';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Heart, User } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '../../Components/Loading';

export default function PostDetailPage() {
  const { id } = useParams();

  const {
    data: post,
    loading: postLoading,
    error: postError,
  } = useFetch<any>(id ? `https://jsonplaceholder.typicode.com/posts/${id}` : '');

  const {
    data: user,
    loading: userLoading,
    error: userError,
  } = useFetch<any>(post ? `https://jsonplaceholder.typicode.com/users/${post.userId}` : '');

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useFetch<any[]>(post ? `https://jsonplaceholder.typicode.com/posts/${post.id}/comments` : '');

  // Related posts based on same user (simulate categories)
  const { data: relatedPosts, loading: relatedLoading } = useFetch<any[]>(
    post ? `https://jsonplaceholder.typicode.com/posts?userId=${post.userId}` : ''
  );

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Load like state from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem(`post-like-${post?.id}`);
    if (savedLikes) {
      const { liked, count } = JSON.parse(savedLikes);
      setLiked(liked);
      setLikeCount(count);
    }
  }, [post?.id]);

  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(likeCount - 1, 0);
    setLiked(newLiked);
    setLikeCount(newCount);
    localStorage.setItem(
      `post-like-${post?.id}`,
      JSON.stringify({ liked: newLiked, count: newCount })
    );
  };

  const loading = postLoading || userLoading || commentsLoading || relatedLoading;
  const error = postError || userError || commentsError;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen"> <LoadingSpinner/> </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Failed to load post
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-12 space-y-10 max-w-5xl mx-auto"
    >
      {/* Post Details Card */}
      <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-6 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {post?.title}
        </h1>
        <div className="flex flex-col md:flex-row gap-2 text-gray-400 text-lg">
          <span className="flex items-center justify-center gap-1">
            <User /> By: {user?.name}
          </span>
          <hr />
          <span>({user?.email})</span>
        </div>
        <p className="mt-4 text-gray-200 text-lg md:text-xl leading-relaxed">{post?.body}</p>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-red-500 transition"
        >
          {liked ? (
            <Heart className="w-6 h-6 text-red-500 fill-red-600" />
          ) : (
            <Heart className="w-6 h-6" />
          )}
          <span className="font-medium">{likeCount}</span>
        </button>
      </div>

      {/* Related Posts Section (4 small cards) */}
      {relatedPosts && relatedPosts.length > 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/posts/${p.id}`}
                  className="block p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-white shadow-sm"
                >
                  <h3 className="font-medium text-sm md:text-base truncate">{p.title}</h3>
                  <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mt-1">{p.body}</p>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Comments Section (Simplified) */}
      <div className="bg-gray-800 dark:bg-gray-700 rounded-xl shadow p-6 md:p-8 space-y-3">
        <h2 className="text-xl font-semibold text-white">Comments ({comments?.length ?? 0})</h2>
        <div className="space-y-2">
          {comments?.map((comment) => (
            <div key={comment.id} className="bg-gray-700 dark:bg-gray-600 rounded-lg p-3">
              <span className="font-medium text-white">{comment.name}</span>
              <p className="text-gray-300 text-sm">{comment.body}</p>
            </div>
          )) ?? null}
        </div>
      </div>
    </motion.div>
  );
}
