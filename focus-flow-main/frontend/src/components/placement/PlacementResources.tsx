import React from 'react';
import { BookOpen, Code2, Presentation, Briefcase, Target } from 'lucide-react';

export function PlacementResources() {
  const resourceCategories = [
    {
      title: "Data Structures & Algorithms",
      icon: Code2,
      color: "bg-[#00E5BC]",
      links: [
        { title: "NeetCode 150", type: "Practice", diff: "Medium" },
        { title: "Striver's SDE Sheet", type: "Sheet", diff: "Hard" },
        { title: "LeetCode Top Interview Questions", type: "Practice", diff: "Varies" }
      ]
    },
    {
      title: "CS Fundamentals",
      icon: BookOpen,
      color: "bg-[#FFDE00]",
      links: [
        { title: "OS Notes (Gate Smashers)", type: "Video", diff: "Easy" },
        { title: "DBMS Interview Questions", type: "Article", diff: "Medium" },
        { title: "Computer Networks Cheatsheet", type: "PDF", diff: "Medium" }
      ]
    },
    {
      title: "Aptitude & Reasoning",
      icon: Target,
      color: "bg-[#FF89BB]",
      links: [
        { title: "IndiaBix Quant", type: "Practice", diff: "Medium" },
        { title: "Logical Reasoning Basics", type: "Video", diff: "Easy" }
      ]
    },
    {
      title: "HR & Resume",
      icon: Briefcase,
      color: "bg-[#00CCFF]",
      links: [
        { title: "Top 50 HR Questions", type: "Article", diff: "Easy" },
        { title: "Resume ATS Checker", type: "Tool", diff: "N/A" },
        { title: "Mock Interview Framework", type: "PDF", diff: "Medium" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {resourceCategories.map((cat, idx) => (
        <div key={idx} className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="flex items-center gap-3 mb-4 border-b-[3px] border-black pb-3">
            <div className={`w-10 h-10 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${cat.color}`}>
              <cat.icon className="w-5 h-5 text-black" />
            </div>
            <h3 className="font-black uppercase text-sm sm:text-base">{cat.title}</h3>
          </div>
          
          <div className="space-y-3">
            {cat.links.map((link, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-2 hover:bg-gray-50 border-[2px] border-transparent hover:border-black transition-colors cursor-pointer group">
                <span className="font-bold text-xs sm:text-sm group-hover:underline underline-offset-4">{link.title}</span>
                <div className="flex gap-2">
                  <span className="text-[9px] font-black uppercase bg-gray-100 border border-black px-1.5 py-0.5">
                    {link.type}
                  </span>
                  <span className="text-[9px] font-black uppercase bg-gray-100 border border-black px-1.5 py-0.5">
                    {link.diff}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
