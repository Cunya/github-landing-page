import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const projects = [
    {
      name: "Star Wars Text Scroller",
      description: "A recreation of the Star Wars Episode IV opening crawl with scrolling text and a starfield background. Implements the classic cinematic effect with CSS 3D transforms.",
      tech: ["HTML", "CSS", "JavaScript", "AI"],
      thumbnail: "/github-landing-page/star-wars-scroller.png",
      link: "https://cunya.github.io/StarWarsScroller/"
    },
    {
      name: "Retro Rasterbars",
      description: "A tribute to classic demoscene effects featuring animated color bars. Implements the visual technique using modern web technologies while maintaining the nostalgic aesthetic.",
      tech: ["Canvas", "JavaScript", "WebGL", "AI"],
      thumbnail: "/github-landing-page/rasterbars.png",
      link: "https://cunya.github.io/Rasterbars/"
    },
    {
      name: "Flame Shader",
      description: "A WebGL implementation of a fire effect using fragment shaders. Simulates flame dynamics with customizable parameters for an interactive experience.",
      tech: ["WebGL", "GLSL", "JavaScript", "AI"],
      thumbnail: "/github-landing-page/flame-shader.png",
      link: "https://cunya.github.io/FlameShader/"
    }
  ];

  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-lavender-blush">
            Demo Effects Collection
          </h1>
          <p className="text-xl text-lavender-blush max-w-2xl mx-auto">
            A selection of classic demo effects implemented with modern web technologies and AI assistance
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
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-thistle/30 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-quartz/30 rounded-full filter blur-3xl animate-float-delayed" />
      </div>
    </main>
  );
} 