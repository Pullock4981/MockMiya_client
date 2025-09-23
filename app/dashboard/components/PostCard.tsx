// 'use client';

// import { motion } from 'framer-motion';
// import { ReactNode } from 'react';

// interface CardProps {
//   children?: ReactNode;
//   hover?: boolean;
//   gradient?: boolean;
//   delay?: number;
//   size?: 'small' | 'medium' | 'large';
//   socialCard?: boolean;
//   className?: string;
// }

// export const Card = ({
//   children,
//   hover = true,
//   gradient = false,
//   delay = 0,
//   size = 'medium',
//   socialCard = false,
//   className = '',
// }: CardProps) => {
//   const sizeClasses = {
//     small: 'p-3 text-sm h-48',
//     medium: 'p-6 text-base h-64',
//     large: 'p-8 text-lg h-80',
//   };

//   const baseClasses = `
//     ${gradient ? 'bg-gradient-secondary' : 'bg-card'}
//     border border-card-border rounded-lg
//     ${hover ? 'hover:bg-card-hover hover:border-border-hover' : ''}
//     transition-all duration-200 shadow-sm
//     ${sizeClasses[size]}
//     flex flex-col
//   `;

//   // Social Card JSX
//   if (socialCard) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay }}
//         whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
//         className={`${baseClasses} w-full max-w-sm bg-white dark:bg-gray-50 ${className}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-3">
//           <div className="flex items-center space-x-2">
//             <img
//               src="https://source.unsplash.com/50x50/?portrait"
//               alt="avatar"
//               className="object-cover w-8 h-8 rounded-full shadow-sm dark:bg-gray-500"
//             />
//             <div className="-space-y-1">
//               <h2 className="text-sm font-semibold leading-none">leroy_jenkins72</h2>
//               <span className="inline-block text-xs leading-none dark:text-gray-600">Somewhere</span>
//             </div>
//           </div>
//           <button title="Options" type="button">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
//               <path d="M256,144a64,64,0,1,0-64-64A64.072,64.072,0,0,0,256,144Z"></path>
//               <path d="M256,368a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,368Z"></path>
//               <path d="M256,192a64,64,0,1,0,64,64A64.072,64.072,0,0,0,256,192Z"></path>
//             </svg>
//           </button>
//         </div>

//         {/* Main Image */}
//         <img
//           src="https://source.unsplash.com/301x301/?random"
//           alt="post"
//           className="object-cover object-center w-full h-72 dark:bg-gray-500"
//         />

//         {/* Footer */}
//         <div className="p-3 flex flex-col gap-3">
//           {/* Actions */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <button title="Like post" className="flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
//                   <path d="M453.122,79.012a128,128,0,0,0-181.087.068l-15.511,15.7L241.142,79.114l-.1-.1a128,128,0,0,0-181.02,0l-6.91,6.91a128,128,0,0,0,0,181.019L235.485,449.314l20.595,21.578L276.4,450.574,460.032,266.94a128.147,128.147,0,0,0,0-181.019Z"></path>
//                 </svg>
//               </button>
//               <button title="Comment post" className="flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
//                   <path d="M496,496H480a273.39,273.39,0,0,1-179.025-66.782L256,416"></path>
//                 </svg>
//               </button>
//               <button title="Share post" className="flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
//                   <path d="M474.444,19.857a20.336,20.336,0,0,0-21.592-2.781L33.737,213.8v38.066"></path>
//                 </svg>
//               </button>
//             </div>
//             <button title="Bookmark post" className="flex items-center justify-center">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
//                 <path d="M424,496H388.75L256.008,381.19,123.467,496H88V16H424Z"></path>
//               </svg>
//             </button>
//           </div>

//           {/* Likes */}
//           <div className="flex items-center pt-2 space-x-2">
//             <div className="flex -space-x-1">
//               <img className="w-5 h-5 border rounded-full" src="https://source.unsplash.com/40x40/?portrait?1" />
//               <img className="w-5 h-5 border rounded-full" src="https://source.unsplash.com/40x40/?portrait?2" />
//               <img className="w-5 h-5 border rounded-full" src="https://source.unsplash.com/40x40/?portrait?3" />
//             </div>
//             <span className="text-sm">
//               Liked by <span className="font-semibold">Mamba UI</span> and <span className="font-semibold">86 others</span>
//             </span>
//           </div>

//           {/* Comment */}
//           <div className="flex flex-col space-y-2">
//             <p className="text-sm">
//               <span className="font-semibold">leroy_jenkins72</span> Nemo ea quasi debitis impedit!
//             </p>
//             <input
//               type="text"
//               placeholder="Add a comment..."
//               className="w-full py-1 text-sm border-none rounded dark:bg-gray-50 dark:text-gray-800 pl-2"
//             />
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // Default Card
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay }}
//       whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
//       className={`${baseClasses} ${className}`}
//     >
//       {children}
//     </motion.div>
//   );
// };




'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    body: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition"
    >
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
      <p className="text-gray-500 dark:text-gray-400 line-clamp-3">{post.body}</p>
      <Link
        href={`/dashboard/posts/${post.id}`}
        className="mt-3 inline-block text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        Read More
      </Link>
    </motion.div>
  );
}
