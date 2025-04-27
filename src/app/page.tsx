import ProjectCard from '@/components/ProjectCard';
import GridBackground from '@/components/GridBackground';

export default function Home() {
  // Determine the base path based on environment
  const basePath = process.env.NODE_ENV === 'production' ? '/github-landing-page' : '';
  
  const projects = [
    {
      name: "Star Wars Text Scroller",
      description: "A recreation of the Star Wars Episode IV opening crawl with scrolling text and a starfield background. Implements the classic cinematic effect with CSS 3D transforms.",
      tech: ["HTML", "CSS", "JavaScript", "AI"],
      thumbnail: `${basePath}/star-wars-scroller.png`,
      link: "https://cunya.github.io/StarWarsScroller/"
    },
    {
      name: "Rasterbars",
      description: "A tribute to classic demoscene effects featuring animated color bars. Implements the visual technique using modern web technologies while maintaining the nostalgic aesthetic.",
      tech: ["Canvas", "JavaScript", "WebGL", "AI"],
      thumbnail: `${basePath}/rasterbars.png`,
      link: "https://cunya.github.io/Rasterbars/"
    },
    {
      name: "Image Based Composite Flame Effect",
      description: "A WebGL implementation of a fire effect using fragment shaders. Simulates flame dynamics with customizable parameters for an interactive experience.",
      tech: ["WebGL", "GLSL", "JavaScript", "AI"],
      thumbnail: `${basePath}/flame-shader.png`,
      link: "https://cunya.github.io/FlameShader/"
    },
    {
      name: "3D Text Scroll",
      description: "An interactive 3D text scrolling effect that creates depth and perspective. Features smooth animations and responsive design for an immersive reading experience.",
      tech: ["Three.js", "JavaScript", "CSS", "AI"],
      thumbnail: `${basePath}/3d-text-scroll.png`,
      link: "https://cunya.github.io/3d-text-scroll/"
    },
    {
      name: "Powerup Tron",
      description: "A modern take on the classic Snake game, inspired by the Tron aesthetic. Features glowing trails and competitive gameplay.",
      tech: ["React", "Canvas", "TypeScript", "AI"],
      thumbnail: `${basePath}/Tron.png`,
      link: "https://cunya.github.io/TronSnake-Cursor-Gemini-2.5-Exp/"
    }
  ];

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Three.js Grid Background */}
      <GridBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4 backdrop-blur-sm bg-space-cadet/10 p-8 rounded-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-lavender-blush drop-shadow-lg">
            LLM Assisted Programming Projects Collection
          </h1>
          <p className="text-xl text-lavender-blush max-w-2xl mx-auto drop-shadow">
            A selection of projects implemented with modern web technologies and AI assistance
          </p>
          <p className="text-md text-lavender-blush/80 mt-4">
            Created by Tamás Martinec
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              tech={project.tech}
              thumbnail={project.thumbnail}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 