
// src/app/resume/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Resume {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

const ResumePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          await Swal.fire({
            icon: "info",
            title: "No resume found",
            text: "You haven't created any resume yet. Redirecting to create one...",
            timer: 2500,
            showConfirmButton: false,
          });
          router.replace("/dashboard/resume");
          return;
        }

        const res = await fetch(`/resume/api/list?userEmail=${userEmail}`);
        const data = await res.json();

        if (!data.success || !data.resumes || data.resumes.length === 0) {
          await Swal.fire({
            icon: "info",
            title: "No resume found",
            text: "You haven't created any resume yet. Redirecting to create one...",
            timer: 2500,
            showConfirmButton: false,
          });
          router.replace("/dashboard/resume");
          return;
        }

        if (data.resumes.length === 1) {
          await Swal.fire({
            icon: "success",
            title: "Resume found",
            text: `We found your saved resume "${data.resumes[0].title}". Redirecting you there...`,
            timer: 2000,
            showConfirmButton: false,
          });
          router.replace(`/resume/${data.resumes[0].id}`);
          return;
        }

        if (data.resumes.length > 1) {
          const htmlContent = data.resumes
            .map(
              (r: Resume) =>
                `<div class="p-2 cursor-pointer hover:bg-gray-100 rounded" onclick="window.location='/resume/${r.id}'">
                  <img src="${r.thumbnailUrl}" alt="${r.title}" class="w-24 h-32 object-cover rounded mb-1"/>
                  <p class="text-center text-sm font-medium">${r.title}</p>
                </div>`
            )
            .join("");

          Swal.fire({
            title: "Select Resume",
            html: `<div class="grid grid-cols-2 gap-2">${htmlContent}</div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            width: "800px",
          });
        }
      } catch (err) {
        // console.error(err);
        await Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "Redirecting to dashboard.",
          timer: 2500,
          showConfirmButton: false,
        });
        router.replace("/dashboard/resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [router]);

  return <div>{loading && <p className="text-center mt-10">Loading...</p>}</div>;
};

export default ResumePage;
