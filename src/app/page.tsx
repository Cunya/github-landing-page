import ProjectCard from '@/components/ProjectCard';

export default function Home() {
  const projects = [
    {
      name: "Star Wars Text Scroller",
      description: "An AI-assisted recreation of the iconic Star Wars Episode IV opening crawl. Features the original 'A New Hope' text with authentic scrolling animation and star field background.",
      tech: ["HTML", "CSS", "JavaScript", "AI"],
      thumbnail: "/github-landing-page/star-wars-scroller.png",
      link: "https://cunya.github.io/StarWarsScroller/"
    },
    {
      name: "Retro Rasterbars",
      description: "A nostalgic demo effect crafted with AI assistance, featuring smooth animated rasterbars that pay homage to the classic demoscene aesthetic. Experience real-time WebGL rendering.",
      tech: ["Canvas", "JavaScript", "WebGL", "AI"],
      thumbnail: "/github-landing-page/rasterbars.png",
      link: "https://cunya.github.io/Rasterbars/"
    },
    {
      name: "Flame Shader",
      description: "An AI-enhanced WebGL flame effect that simulates realistic fire dynamics. Features interactive controls and real-time rendering with fragment shaders for a mesmerizing visual experience.",
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
            AI-Enhanced Demo Effects
          </h1>
          <p className="text-xl text-lavender-blush max-w-2xl mx-auto">
            Explore my collection of classic demo effects reimagined through AI collaboration, combining retro aesthetics with modern web technologies
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