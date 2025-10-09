// "use client";

// import React, { useState, useEffect, JSX } from "react";
// import { LoadingSpinner} from "../components/Loading";

// type Role = {
//   id: string;
//   title: string;
//   subtitle: string;
// };

// type InterviewType = "behavioral" | "technical" | "situational" | "mixed";

// const ROLES: Role[] = [
//   {
//     id: "se",
//     title: "Software Engineer",
//     subtitle: "Technical coding, system design, and problem-solving questions",
//   },
//   {
//     id: "pm",
//     title: "Product Manager",
//     subtitle:
//       "Product strategy, stakeholder management, and metrics driven decisions",
//   },
//   {
//     id: "ds",
//     title: "Data Scientist",
//     subtitle: "Statistical analysis, machine learning, and data interpretation",
//   },
//   {
//     id: "mm",
//     title: "Marketing Manager",
//     subtitle: "Campaign strategy, brand management, and customer acquisition",
//   },
//   {
//     id: "sr",
//     title: "Sales Representative",
//     subtitle: "Customer relations, negotiation, and revenue generation",
//   },
//   {
//     id: "ux",
//     title: "UX Designer",
//     subtitle: "User research, design thinking, and interface optimization",
//   },
// ];

// export default function TextInterview(): JSX.Element {
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [interviewType, setInterviewType] = useState<InterviewType | null>(
//     null
//   );
//   const [inInterview, setInInterview] = useState(false);
//   const [questions, setQuestions] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<string[]>([]);
//   const [localAnswer, setLocalAnswer] = useState("");
//   const [time, setTime] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [evaluation, setEvaluation] = useState<any>(null);
//   const [completed, setCompleted] = useState(false);

//   useEffect(() => {
//     let t: number | undefined;
//     if (inInterview) t = window.setInterval(() => setTime((s) => s + 1), 1000);
//     return () => t && clearInterval(t);
//   }, [inInterview]);

//   // start interview: fetch 5 questions
//   async function startInterview(type: InterviewType) {
//     if (!selectedRole) return;
//     setInterviewType(type);
//     setInInterview(true);
//     setTime(0);
//     setCompleted(false);
//     setAnswers([]);
//     setQuestions([]);
//     setCurrentIndex(0);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "generateQuestions",
//           topic: selectedRole.title,
//         }),
//       });
//       const data = await res.json();
//       const qs: string[] = data.questions ?? [];
//       setQuestions(qs.slice(0, 5));
//       setAnswers(Array(5).fill(""));
//     } catch (err) {
//       console.error(err);
//       setQuestions(Array.from({ length: 5 }, (_, i) => `Question ${i + 1}`));
//       setAnswers(Array(5).fill(""));
//     } finally {
//       setLoading(false);
//     }
//   }

//   function saveCurrentAnswer() {
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//   }

//   function goPrevious() {
//     if (currentIndex === 0) return;
//     saveCurrentAnswer();
//     setLocalAnswer(answers[currentIndex - 1] ?? "");
//     setCurrentIndex((i) => i - 1);
//   }

//   async function goNextOrFinish() {
//     // save
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//     setLocalAnswer("");

//     if (currentIndex < 4) {
//       // next
//       setCurrentIndex((i) => i + 1);
//       setLocalAnswer(copy[currentIndex + 1] ?? "");
//     } else {
//       // finish session of 5
//       await finishInterview(copy);
//     }
//   }

//   async function finishInterview(finalAnswers: string[]) {
//     setLoading(true);
//     setCompleted(true);
//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "evaluateSession",
//           questions,
//           answers: finalAnswers,
//         }),
//       });
//       const data = await res.json();
//       setEvaluation(
//         data.evaluation ?? { score: 0, feedback: "No evaluation returned." }
//       );
//     } catch (err) {
//       console.error(err);
//       setEvaluation({ score: 0, feedback: "Evaluation failed." });
//     } finally {
//       setLoading(false);
//       setInInterview(false);
//     }
//   }

//   const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
//     <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
//       <div className="text-lg font-semibold">{role.title}</div>
//       <div className="text-sm text-gray-500 mt-2">{role.subtitle}</div>
//       <button
//         onClick={() => setSelectedRole(role)}
//         className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
//       >
//         Select Role
//       </button>
//     </div>
//   );

//   // UI flows
//   if (!selectedRole) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-center text-2xl font-bold mb-1">
//             Choose Your Role
//           </h1>
//           <p className="text-center text-sm text-gray-500 mb-8">
//             Select the position you want to practice interviewing for
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {ROLES.map((role) => (
//               <RoleCard key={role.id} role={role} />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (!inInterview && !completed) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <button
//             className="mb-4 text-sm text-gray-600"
//             onClick={() => setSelectedRole(null)}
//           >
//             ← Back to Role Selection
//           </button>
//           <h2 className="text-xl font-semibold mb-1">Choose Interview Type</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Selected Role:{" "}
//             <span className="font-medium">{selectedRole.title}</span>
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               {
//                 type: "behavioral",
//                 emoji: "👤",
//                 title: "Behavioral Interview",
//                 desc: "Questions about past experiences, leadership, and teamwork",
//               },
//               {
//                 type: "technical",
//                 emoji: "⚡",
//                 title: "Technical Interview",
//                 desc: "Role-specific technical skills and knowledge assessment",
//               },
//               {
//                 type: "situational",
//                 emoji: "🎯",
//                 title: "Situational Interview",
//                 desc: "Hypothetical scenarios and problem-solving approaches",
//               },
//               {
//                 type: "mixed",
//                 emoji: "🔀",
//                 title: "Mixed Interview",
//                 desc: "Combination of all interview types",
//               },
//             ].map(({ type, emoji, title, desc }) => (
//               <div key={type} className="border rounded-lg p-6 bg-white">
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{emoji}</div>
//                   <div>
//                     <div className="font-semibold">{title}</div>
//                     <div className="text-sm text-gray-500">{desc}</div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => startInterview(type as InterviewType)}
//                   className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
//                 >
//                   Start Interview
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (inInterview && questions.length > 0 && !completed) {
//     const question = questions[currentIndex] ?? `Question ${currentIndex + 1}`;
//     const MAX_CHARS = 1000;
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={() => setInInterview(false)}
//               className="text-sm text-gray-600 hover:text-gray-800"
//             >
//               ← End Interview
//             </button>
//             <div className="text-sm text-gray-500">
//               Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6 mb-4">
//             <div className="text-sm text-gray-600 mb-2">
//               Question {currentIndex + 1} of 5
//             </div>
//             <div className="font-medium">{question}</div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <textarea
//               value={localAnswer}
//               onChange={(e) => {
//                 if (e.target.value.length <= MAX_CHARS)
//                   setLocalAnswer(e.target.value);
//               }}
//               className="w-full h-40 border rounded p-3 text-sm"
//               placeholder="Type your answer here..."
//             />
//             <div className="text-xs text-gray-500 mt-1 text-right">
//               {localAnswer.length}/{MAX_CHARS}
//             </div>

//             <div className="flex flex-wrap justify-between mt-6 gap-3">
//               <div className="flex gap-2">
//                 <button
//                   onClick={goPrevious}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   ← Previous
//                 </button>
//                 <button
//                   onClick={goNextOrFinish}
//                   disabled={!localAnswer || loading}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   {currentIndex === 4 ? "Finish" : "Next →"}
//                 </button>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setInInterview(false);
//                     setQuestions([]);
//                     setLocalAnswer("");
//                     setAnswers([]);
//                   }}
//                   className="border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (completed && evaluation) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-2xl mx-auto bg-white border rounded p-8 text-center">
//           <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
//           <div className="text-6xl font-extrabold text-blue-600">
//             {evaluation?.score ?? 0}%
//           </div>
//           <p className="text-gray-500 mt-4">{evaluation?.feedback}</p>
//           <div className="mt-6">
//             <button
//               onClick={() => {
//                 setSelectedRole(null);
//                 setInInterview(false);
//                 setCompleted(false);
//                 setEvaluation(null);
//               }}
//               className="border px-4 py-2 rounded"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <>
//       <p className="text-foreground font-medium">Please wait...</p>
//       <LoadingSpinner />
//     </>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { LoadingSpinner } from "../components/Loading";

// type Role = {
//   id: string;
//   title: string;
//   subtitle: string;
// };

// type InterviewType = "behavioral" | "technical" | "situational" | "mixed";

// interface Evaluation {
//   score: number;
//   feedback: string;
// }

// const ROLES: Role[] = [
//   {
//     id: "se",
//     title: "Software Engineer",
//     subtitle: "Technical coding, system design, and problem-solving questions",
//   },
//   {
//     id: "pm",
//     title: "Product Manager",
//     subtitle:
//       "Product strategy, stakeholder management, and metrics-driven decisions",
//   },
//   {
//     id: "ds",
//     title: "Data Scientist",
//     subtitle: "Statistical analysis, machine learning, and data interpretation",
//   },
//   {
//     id: "mm",
//     title: "Marketing Manager",
//     subtitle: "Campaign strategy, brand management, and customer acquisition",
//   },
//   {
//     id: "sr",
//     title: "Sales Representative",
//     subtitle: "Customer relations, negotiation, and revenue generation",
//   },
//   {
//     id: "ux",
//     title: "UX Designer",
//     subtitle: "User research, design thinking, and interface optimization",
//   },
// ];

// export default function TextInterview() {
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [interviewType, setInterviewType] = useState<InterviewType | null>(
//     null
//   );
//   const [inInterview, setInInterview] = useState(false);
//   const [questions, setQuestions] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<string[]>([]);
//   const [localAnswer, setLocalAnswer] = useState("");
//   const [time, setTime] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
//   const [completed, setCompleted] = useState(false);

//   // Timer logic with cleanup
//   useEffect(() => {
//     let t: ReturnType<typeof setInterval> | undefined;
//     if (inInterview) {
//       t = setInterval(() => setTime((s) => s + 1), 1000);
//     }
//     return () => {
//       if (t) clearInterval(t);
//     };
//   }, [inInterview]);

//   // Start interview
//   async function startInterview(type: InterviewType) {
//     if (!selectedRole) return;
//     setInterviewType(type);
//     setInInterview(true);
//     setTime(0);
//     setCompleted(false);
//     setAnswers([]);
//     setQuestions([]);
//     setCurrentIndex(0);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "generateQuestions",
//           topic: selectedRole.title,
//         }),
//       });
//       const data = await res.json();
//       const qs: string[] = data.questions ?? [];
//       setQuestions(qs.slice(0, 5));
//       setAnswers(Array(5).fill(""));
//     } catch (err) {
//       console.error(err);
//       setQuestions(Array.from({ length: 5 }, (_, i) => `Question ${i + 1}`));
//       setAnswers(Array(5).fill(""));
//     } finally {
//       setLoading(false);
//     }
//   }

//   function saveCurrentAnswer() {
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//   }

//   function goPrevious() {
//     if (currentIndex === 0) return;
//     saveCurrentAnswer();
//     setLocalAnswer(answers[currentIndex - 1] ?? "");
//     setCurrentIndex((i) => i - 1);
//   }

//   async function goNextOrFinish() {
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//     setLocalAnswer("");

//     if (currentIndex < 4) {
//       setCurrentIndex((i) => i + 1);
//       setLocalAnswer(copy[currentIndex + 1] ?? "");
//     } else {
//       await finishInterview(copy);
//     }
//   }

//   async function finishInterview(finalAnswers: string[]) {
//     setLoading(true);
//     setCompleted(true);
//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "evaluateSession",
//           questions,
//           answers: finalAnswers,
//         }),
//       });
//       const data = await res.json();
//       setEvaluation(
//         data.evaluation ?? { score: 0, feedback: "No evaluation returned." }
//       );
//     } catch (err) {
//       console.error(err);
//       setEvaluation({ score: 0, feedback: "Evaluation failed." });
//     } finally {
//       setLoading(false);
//       setInInterview(false);
//     }
//   }

//   const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
//     <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
//       <div className="text-lg font-semibold">{role.title}</div>
//       <div className="text-sm text-gray-500 mt-2">{role.subtitle}</div>
//       <button
//         onClick={() => setSelectedRole(role)}
//         className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
//       >
//         Select Role
//       </button>
//     </div>
//   );

//   // Step 1: Choose Role
//   if (!selectedRole) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-center text-2xl font-bold mb-1">
//             Choose Your Role
//           </h1>
//           <p className="text-center text-sm text-gray-500 mb-8">
//             Select the position you want to practice interviewing for
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {ROLES.map((role) => (
//               <RoleCard key={role.id} role={role} />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 2: Choose Interview Type
//   if (!inInterview && !completed) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <button
//             className="mb-4 text-sm text-gray-600"
//             onClick={() => setSelectedRole(null)}
//           >
//             ← Back to Role Selection
//           </button>
//           <h2 className="text-xl font-semibold mb-1">Choose Interview Type</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Selected Role:{" "}
//             <span className="font-medium">{selectedRole.title}</span>
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               {
//                 type: "behavioral",
//                 emoji: "👤",
//                 title: "Behavioral Interview",
//                 desc: "Questions about past experiences, leadership, and teamwork",
//               },
//               {
//                 type: "technical",
//                 emoji: "⚡",
//                 title: "Technical Interview",
//                 desc: "Role-specific technical skills and knowledge assessment",
//               },
//               {
//                 type: "situational",
//                 emoji: "🎯",
//                 title: "Situational Interview",
//                 desc: "Hypothetical scenarios and problem-solving approaches",
//               },
//               {
//                 type: "mixed",
//                 emoji: "🔀",
//                 title: "Mixed Interview",
//                 desc: "Combination of all interview types",
//               },
//             ].map(({ type, emoji, title, desc }) => (
//               <div key={type} className="border rounded-lg p-6 bg-white">
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{emoji}</div>
//                   <div>
//                     <div className="font-semibold">{title}</div>
//                     <div className="text-sm text-gray-500">{desc}</div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => startInterview(type as InterviewType)}
//                   className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
//                 >
//                   Start Interview
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 3: Question & Answer
//   if (inInterview && questions.length > 0 && !completed) {
//     const question = questions[currentIndex] ?? `Question ${currentIndex + 1}`;
//     const MAX_CHARS = 1000;
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={() => setInInterview(false)}
//               className="text-sm text-gray-600 hover:text-gray-800"
//             >
//               ← End Interview
//             </button>
//             <div className="text-sm text-gray-500">
//               Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6 mb-4">
//             <div className="text-sm text-gray-600 mb-2">
//               Question {currentIndex + 1} of 5
//             </div>
//             <div className="font-medium">{question}</div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <textarea
//               value={localAnswer}
//               onChange={(e) => {
//                 if (e.target.value.length <= MAX_CHARS)
//                   setLocalAnswer(e.target.value);
//               }}
//               className="w-full h-40 border rounded p-3 text-sm"
//               placeholder="Type your answer here..."
//             />
//             <div className="text-xs text-gray-500 mt-1 text-right">
//               {localAnswer.length}/{MAX_CHARS}
//             </div>

//             <div className="flex flex-wrap justify-between mt-6 gap-3">
//               <div className="flex gap-2">
//                 <button
//                   onClick={goPrevious}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   ← Previous
//                 </button>
//                 <button
//                   onClick={goNextOrFinish}
//                   disabled={!localAnswer || loading}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   {currentIndex === 4 ? "Finish" : "Next →"}
//                 </button>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setInInterview(false);
//                     setQuestions([]);
//                     setLocalAnswer("");
//                     setAnswers([]);
//                   }}
//                   className="border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 4: Evaluation
//   if (completed && evaluation) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-2xl mx-auto bg-white border rounded p-8 text-center">
//           <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
//           <div className="text-6xl font-extrabold text-blue-600">
//             {evaluation?.score ?? 0}%
//           </div>
//           <p className="text-gray-500 mt-4">{evaluation?.feedback}</p>
//           <div className="mt-6">
//             <button
//               onClick={() => {
//                 setSelectedRole(null);
//                 setInInterview(false);
//                 setCompleted(false);
//                 setEvaluation(null);
//               }}
//               className="border px-4 py-2 rounded"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Loading fallback
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <p className="text-gray-600 font-medium mb-2">Please wait...</p>
//       <LoadingSpinner />
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { LoadingSpinner } from "../components/Loading";

// type Role = {
//   id: string;
//   title: string;
//   subtitle: string;
// };

// type InterviewType = "behavioral" | "technical" | "situational" | "mixed";

// interface Evaluation {
//   score: number;
//   feedback: string;
// }

// const ROLES: Role[] = [
//   {
//     id: "se",
//     title: "Software Engineer",
//     subtitle: "Technical coding, system design, and problem-solving questions",
//   },
//   {
//     id: "pm",
//     title: "Product Manager",
//     subtitle:
//       "Product strategy, stakeholder management, and metrics-driven decisions",
//   },
//   {
//     id: "ds",
//     title: "Data Scientist",
//     subtitle: "Statistical analysis, machine learning, and data interpretation",
//   },
//   {
//     id: "mm",
//     title: "Marketing Manager",
//     subtitle: "Campaign strategy, brand management, and customer acquisition",
//   },
//   {
//     id: "sr",
//     title: "Sales Representative",
//     subtitle: "Customer relations, negotiation, and revenue generation",
//   },
//   {
//     id: "ux",
//     title: "UX Designer",
//     subtitle: "User research, design thinking, and interface optimization",
//   },
// ];

// export default function TextInterview() {
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
//   const [inInterview, setInInterview] = useState(false);
//   const [questions, setQuestions] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<string[]>([]);
//   const [localAnswer, setLocalAnswer] = useState("");
//   const [time, setTime] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
//   const [completed, setCompleted] = useState(false);

//   // Timer logic
//   useEffect(() => {
//     let t: ReturnType<typeof setInterval> | undefined;
//     if (inInterview) {
//       t = setInterval(() => setTime((s) => s + 1), 1000);
//     }
//     return () => {
//       if (t) clearInterval(t);
//     };
//   }, [inInterview]);

//   // Start interview
//   async function startInterview(type: InterviewType) {
//     if (!selectedRole) return;
//     setInterviewType(type);
//     setInInterview(true);
//     setTime(0);
//     setCompleted(false);
//     setAnswers([]);
//     setQuestions([]);
//     setCurrentIndex(0);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "generateQuestions",
//           topic: `${selectedRole.title} (${type} interview)`,
//         }),
//       });

//       const data = await res.json();
//       const qs: string[] = data.questions ?? [];
//       setQuestions(qs.slice(0, 5));
//       setAnswers(Array(5).fill(""));
//     } catch (err) {
//       console.error(err);
//       setQuestions(Array.from({ length: 5 }, (_, i) => `Question ${i + 1}`));
//       setAnswers(Array(5).fill(""));
//     } finally {
//       setLoading(false);
//     }
//   }

//   function saveCurrentAnswer() {
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//   }

//   function goPrevious() {
//     if (currentIndex === 0) return;
//     saveCurrentAnswer();
//     setLocalAnswer(answers[currentIndex - 1] ?? "");
//     setCurrentIndex((i) => i - 1);
//   }

//   async function goNextOrFinish() {
//     const copy = [...answers];
//     copy[currentIndex] = localAnswer;
//     setAnswers(copy);
//     setLocalAnswer("");

//     if (currentIndex < 4) {
//       setCurrentIndex((i) => i + 1);
//       setLocalAnswer(copy[currentIndex + 1] ?? "");
//     } else {
//       await finishInterview(copy);
//     }
//   }

//   async function finishInterview(finalAnswers: string[]) {
//     setLoading(true);
//     setCompleted(true);
//     try {
//       const res = await fetch("/api/generate/text-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "evaluateSession",
//           questions,
//           answers: finalAnswers,
//         }),
//       });
//       const data = await res.json();
//       setEvaluation(
//         data.evaluation ?? { score: 0, feedback: "No evaluation returned." }
//       );
//     } catch (err) {
//       console.error(err);
//       setEvaluation({ score: 0, feedback: "Evaluation failed." });
//     } finally {
//       setLoading(false);
//       setInInterview(false);
//     }
//   }

//   const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
//     <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
//       <div className="text-lg font-semibold">{role.title}</div>
//       <div className="text-sm text-gray-500 mt-2">{role.subtitle}</div>
//       <button
//         onClick={() => setSelectedRole(role)}
//         className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
//       >
//         Select Role
//       </button>
//     </div>
//   );

//   // Step 1: Choose Role
//   if (!selectedRole) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-center text-2xl font-bold mb-1">
//             Choose Your Role
//           </h1>
//           <p className="text-center text-sm text-gray-500 mb-8">
//             Select the position you want to practice interviewing for
//           </p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {ROLES.map((role) => (
//               <RoleCard key={role.id} role={role} />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 2: Choose Interview Type
//   if (!inInterview && !completed) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <button
//             className="mb-4 text-sm text-gray-600"
//             onClick={() => setSelectedRole(null)}
//           >
//             ← Back to Role Selection
//           </button>
//           <h2 className="text-xl font-semibold mb-1">Choose Interview Type</h2>
//           <p className="text-sm text-gray-500 mb-6">
//             Selected Role:{" "}
//             <span className="font-medium">{selectedRole.title}</span>
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               {
//                 type: "behavioral",
//                 emoji: "👤",
//                 title: "Behavioral Interview",
//                 desc: "Questions about past experiences, leadership, and teamwork",
//               },
//               {
//                 type: "technical",
//                 emoji: "⚡",
//                 title: "Technical Interview",
//                 desc: "Role-specific technical skills and knowledge assessment",
//               },
//               {
//                 type: "situational",
//                 emoji: "🎯",
//                 title: "Situational Interview",
//                 desc: "Hypothetical scenarios and problem-solving approaches",
//               },
//               {
//                 type: "mixed",
//                 emoji: "🔀",
//                 title: "Mixed Interview",
//                 desc: "Combination of all interview types",
//               },
//             ].map(({ type, emoji, title, desc }) => (
//               <div key={type} className="border rounded-lg p-6 bg-white">
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{emoji}</div>
//                   <div>
//                     <div className="font-semibold">{title}</div>
//                     <div className="text-sm text-gray-500">{desc}</div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => startInterview(type as InterviewType)}
//                   className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
//                 >
//                   Start Interview
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 3: Question & Answer
//   if (inInterview && questions.length > 0 && !completed) {
//     const question = questions[currentIndex] ?? `Question ${currentIndex + 1}`;
//     const MAX_CHARS = 1000;
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={() => setInInterview(false)}
//               className="text-sm text-gray-600 hover:text-gray-800"
//             >
//               ← End Interview
//             </button>
//             <div className="text-sm text-gray-500">
//               Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
//             </div>
//           </div>

//           <div className="bg-white border rounded p-6 mb-4">
//             <div className="text-sm text-gray-600 mb-2">
//               Question {currentIndex + 1} of 5
//             </div>
//             <div className="font-medium">{question}</div>
//           </div>

//           <div className="bg-white border rounded p-6">
//             <textarea
//               value={localAnswer}
//               onChange={(e) => {
//                 if (e.target.value.length <= MAX_CHARS)
//                   setLocalAnswer(e.target.value);
//               }}
//               className="w-full h-40 border rounded p-3 text-sm"
//               placeholder="Type your answer here..."
//             />
//             <div className="text-xs text-gray-500 mt-1 text-right">
//               {localAnswer.length}/{MAX_CHARS}
//             </div>

//             <div className="flex flex-wrap justify-between mt-6 gap-3">
//               <div className="flex gap-2">
//                 <button
//                   onClick={goPrevious}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   ← Previous
//                 </button>
//                 <button
//                   onClick={goNextOrFinish}
//                   disabled={!localAnswer || loading}
//                   className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   {currentIndex === 4 ? "Finish" : "Next →"}
//                 </button>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setInInterview(false);
//                     setQuestions([]);
//                     setLocalAnswer("");
//                     setAnswers([]);
//                   }}
//                   className="border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Step 4: Evaluation
//   if (completed && evaluation) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-8">
//         <div className="max-w-2xl mx-auto bg-white border rounded p-8 text-center">
//           <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
//           <div className="text-6xl font-extrabold text-blue-600">
//             {evaluation?.score ?? 0}%
//           </div>
//           <p className="text-gray-500 mt-4">{evaluation?.feedback}</p>
//           <div className="mt-6">
//             <button
//               onClick={() => {
//                 setSelectedRole(null);
//                 setInInterview(false);
//                 setCompleted(false);
//                 setEvaluation(null);
//               }}
//               className="border px-4 py-2 rounded"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // Loading fallback
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <p className="text-gray-600 font-medium mb-2">Please wait...</p>
//       <LoadingSpinner />
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../components/Loading";

type Role = {
  id: string;
  title: string;
  subtitle: string;
};

type InterviewType = "behavioral" | "technical" | "situational" | "mixed";

interface Evaluation {
  score: number;
  feedback: string;
}

const ROLES: Role[] = [
  { id: "se", title: "Software Engineer", subtitle: "Technical coding, system design, and problem-solving questions" },
  { id: "pm", title: "Product Manager", subtitle: "Product strategy, stakeholder management, and metrics-driven decisions" },
  { id: "ds", title: "Data Scientist", subtitle: "Statistical analysis, machine learning, and data interpretation" },
  { id: "mm", title: "Marketing Manager", subtitle: "Campaign strategy, brand management, and customer acquisition" },
  { id: "sr", title: "Sales Representative", subtitle: "Customer relations, negotiation, and revenue generation" },
  { id: "ux", title: "UX Designer", subtitle: "User research, design thinking, and interface optimization" },
];

export default function TextInterview() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [inInterview, setInInterview] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [localAnswer, setLocalAnswer] = useState("");
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [completed, setCompleted] = useState(false);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (inInterview) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inInterview]);

  // Start interview
  async function startInterview(type: InterviewType) {
    if (!selectedRole) return;
    setInterviewType(type);
    setInInterview(true);
    setTime(0);
    setCompleted(false);
    setAnswers([]);
    setQuestions([]);
    setCurrentIndex(0);
    setLoading(true);

    try {
      const res = await fetch("/api/generate/text-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generateQuestions", topic: selectedRole.title }),
      });
      const data = await res.json();
      const qs: string[] = data.questions ?? [];
      setQuestions(qs.slice(0, 5));
      setAnswers(Array(5).fill(""));
    } catch (err) {
      console.error(err);
      setQuestions(Array.from({ length: 5 }, (_, i) => `Question ${i + 1}`));
      setAnswers(Array(5).fill(""));
    } finally {
      setLoading(false);
    }
  }

  function saveCurrentAnswer() {
    const copy = [...answers];
    copy[currentIndex] = localAnswer;
    setAnswers(copy);
  }

  function goPrevious() {
    if (currentIndex === 0) return;
    saveCurrentAnswer();
    setLocalAnswer(answers[currentIndex - 1] ?? "");
    setCurrentIndex((i) => i - 1);
  }

  async function goNextOrFinish() {
    const copy = [...answers];
    copy[currentIndex] = localAnswer;
    setAnswers(copy);
    setLocalAnswer("");

    if (currentIndex < 4) {
      setCurrentIndex((i) => i + 1);
      setLocalAnswer(copy[currentIndex + 1] ?? "");
    } else {
      await finishInterview(copy);
    }
  }

  async function finishInterview(finalAnswers: string[]) {
    setLoading(true);
    setCompleted(true);
    try {
      const res = await fetch("/api/generate/text-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluateSession",
          questions,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation ?? { score: 0, feedback: "No evaluation returned." });
    } catch (err) {
      console.error(err);
      setEvaluation({ score: 0, feedback: "Evaluation failed." });
    } finally {
      setLoading(false);
      setInInterview(false);
    }
  }

  const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
      <div className="text-lg font-semibold">{role.title}</div>
      <div className="text-sm text-gray-500 mt-2">{role.subtitle}</div>
      <button
        onClick={() => setSelectedRole(role)}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
      >
        Select Role
      </button>
    </div>
  );

  // Step 1: choose role
  if (!selectedRole) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-center text-2xl font-bold mb-1">Choose Your Role</h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Select the position you want to practice interviewing for
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((r) => (
              <RoleCard key={r.id} role={r} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Step 2: choose interview type
  if (!inInterview && !completed) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <button className="mb-4 text-sm text-gray-600" onClick={() => setSelectedRole(null)}>
            ← Back to Role Selection
          </button>
          <h2 className="text-xl font-semibold mb-1">Choose Interview Type</h2>
          <p className="text-sm text-gray-500 mb-6">
            Selected Role: <span className="font-medium">{selectedRole.title}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { type: "behavioral", emoji: "👤", title: "Behavioral Interview", desc: "Questions about past experiences, leadership, and teamwork" },
              { type: "technical", emoji: "⚡", title: "Technical Interview", desc: "Role-specific technical skills and knowledge assessment" },
              { type: "situational", emoji: "🎯", title: "Situational Interview", desc: "Hypothetical scenarios and problem-solving approaches" },
              { type: "mixed", emoji: "🔀", title: "Mixed Interview", desc: "Combination of all interview types" },
            ].map(({ type, emoji, title, desc }) => (
              <div key={type} className="border rounded-lg p-6 bg-white">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{emoji}</div>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => startInterview(type as InterviewType)}
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
                >
                  Start Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Step 3: Q&A
  if (inInterview && questions.length > 0 && !completed) {
    const question = questions[currentIndex] ?? `Question ${currentIndex + 1}`;
    const MAX_CHARS = 1000;
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setInInterview(false)} className="text-sm text-gray-600 hover:text-gray-800">
              ← End Interview
            </button>
            <div className="text-sm text-gray-500">
              Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            </div>
          </div>

          {/* Display interview type to use the variable */}
          {interviewType && (
            <div className="text-center mb-2 text-sm text-blue-600">
              Interview Type: {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}
            </div>
          )}

          <div className="bg-white border rounded p-6 mb-4">
            <div className="text-sm text-gray-600 mb-2">Question {currentIndex + 1} of 5</div>
            <div className="font-medium">{question}</div>
          </div>

          <div className="bg-white border rounded p-6">
            <textarea
              value={localAnswer}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setLocalAnswer(e.target.value);
              }}
              className="w-full h-40 border rounded p-3 text-sm"
              placeholder="Type your answer here..."
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {localAnswer.length}/{MAX_CHARS}
            </div>

            <div className="flex flex-wrap justify-between mt-6 gap-3">
              <div className="flex gap-2">
                <button onClick={goPrevious} className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">
                  ← Previous
                </button>
                <button
                  onClick={goNextOrFinish}
                  disabled={!localAnswer || loading}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                >
                  {currentIndex === 4 ? "Finish" : "Next →"}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setInInterview(false);
                    setQuestions([]);
                    setLocalAnswer("");
                    setAnswers([]);
                  }}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Step 4: Evaluation
  if (completed && evaluation) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white border rounded p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
          <div className="text-6xl font-extrabold text-blue-600">{evaluation?.score ?? 0}%</div>
          <p className="text-gray-500 mt-4">{evaluation?.feedback}</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedRole(null);
                setInInterview(false);
                setCompleted(false);
                setEvaluation(null);
              }}
              className="border px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Loading
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-gray-600 font-medium mb-2">Please wait...</p>
      <LoadingSpinner />
    </div>
  );
}
