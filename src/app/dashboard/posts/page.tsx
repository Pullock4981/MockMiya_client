// 'use client';

// import { useInfiniteFetch } from '@/hook/useInfiniteFetch';
// import { motion } from 'framer-motion';
// import { ArrowRight, Calendar, User } from 'lucide-react';
// import Link from 'next/link';
// import { useCallback, useRef } from 'react';
// import { Card } from '../Components/Card';
// import { LoadingSpinner } from '../Components/Loading';

// interface Post {
//   id: number;
//   title: string;
//   body: string;
//   userId: number;
// }

// export default function Posts() {
//   const {
//     data: posts,
//     loading,
//     hasMore,
//     loadMore,
//     error,
//   } = useInfiniteFetch<Post>(
//     'https://jsonplaceholder.typicode.com/posts',
//     6 // 6 post per page
//   );

//   // Intersection Observer for infinite scroll
//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastPostRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setTimeout(() => {
//             loadMore(); // add small delay for spinner effect
//           }, 500);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore, loadMore]
//   );

//   if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-center w-full">
//         <div>
//           <h1 className="text-3xl font-bold">Posts</h1>
//           <p className="text-foreground-muted">Explore all blog posts and articles</p>
//         </div>
//       </div>

//       {/* Posts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {posts.map((post, index) => (
//           <Link key={post.id} href={`/dashboard/posts/${post.id}`} className="block group">
//             <Card hover delay={index * 0.05} className="h-64 flex flex-col justify-between p-4">
//               {/* Header */}
//               <div className="flex items-start justify-between mb-3">
//                 <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
//                   <span className="text-sm font-bold text-white">{post.id}</span>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
//               </div>

//               {/* Content */}
//               <div className="flex-1 space-y-2 overflow-hidden">
//                 <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors capitalize">
//                   {post.title}
//                 </h3>
//                 <p className="text-foreground-muted text-sm text-justify line-clamp-3 break-words">
//                   {post.body}
//                 </p>
//               </div>

//               {/* Footer */}
//               <div className="flex items-end justify-between gap-4 pt-4 border-t border-card-border mt-4 text-xs text-foreground-muted">
//                 <div className="flex items-center gap-2">
//                   <User className="w-3 h-3" /> User {post.userId}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-3 h-3" /> 2 days ago
//                 </div>
//               </div>
//             </Card>
//           </Link>
//         ))}
//       </div>

//       {/* Load More Button */}
//       {hasMore && !loading && (
//         <div className="flex justify-center py-6">
//           <button
//             onClick={loadMore}
//             className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {/* Loading Spinner */}
//       {loading && (
//         <div className="flex justify-center py-6">
//           <LoadingSpinner size="lg" />
//         </div>
//       )}

//       {/* Stats */}
//       {posts.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="text-center py-8"
//         >
//           <p className="text-foreground-muted">
//             Showing <span className="font-medium text-foreground">{posts.length}</span> posts
//           </p>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }

'use client';

import { useFetch } from '@/app/hook/useFetch';
import { motion } from 'framer-motion';
import PostCard from '../components/PostCard';
import { LoadingSpinner } from '../Components/Loading';

export default function PostsPage() {
  const {
    data: posts,
    loading,
    error,
  } = useFetch<any[]>('https://jsonplaceholder.typicode.com/posts');

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen"> <LoadingSpinner/> </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        Failed to load posts
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-12 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-center w-full pb-8">
        <div>
          <h1 className="text-3xl font-bold text-center">Posts</h1>
          <p className="text-foreground-muted">Explore all blog posts and articles</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
}
