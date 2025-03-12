'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  name: string;
  description: string;
  tech: string[];
  thumbnail: string;
  link: string;
}

export default function ProjectCard({ name, description, tech, thumbnail, link }: ProjectCardProps) {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" 
      className="block group h-full">
      <div className="bg-space-cadet/70 backdrop-blur-md rounded-xl overflow-hidden card-hover border border-mountbatten/50 flex flex-col h-full shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-thistle/20 group-hover:translate-y-[-5px]">
        <div className="relative w-full pt-[56.25%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-thistle/10 to-rose-quartz/10 group-hover:opacity-50 transition-opacity z-10" />
          <Image
            src={thumbnail}
            alt={`${name} thumbnail`}
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-6 space-y-4 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold text-lavender-blush drop-shadow">
            {name}
          </h3>
          <p className="text-lavender-blush leading-relaxed flex-grow">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2 mt-auto">
            {tech.map((technology) => (
              <span
                key={technology}
                className="px-3 py-1 text-sm bg-mountbatten/40 text-lavender-blush rounded-full border border-rose-quartz/30 backdrop-blur-sm"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 