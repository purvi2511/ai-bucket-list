import { PartyPopper, Rocket, Compass } from 'lucide-react';

export function Welcome() {
  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Suggestions',
      description: 'Get a list of ideas tailored to your unique interests and dreams.',
    },
    {
      icon: <Compass className="h-8 w-8 text-primary" />,
      title: 'Explore Possibilities',
      description: 'Discover new adventures you might not have thought of.',
    },
    {
      icon: <PartyPopper className="h-8 w-8 text-primary" />,
      title: 'Start Your Adventure',
      description: 'Turn your dreams into a plan. Let\'s build your ultimate bucket list!',
    },
  ];

  return (
    <div className="mt-12 text-center">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Welcome to Your Adventure Planner
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Ready to turn your dreams into reality? Tell us what you love, and our AI will craft a personalized bucket list just for you.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm">
            {feature.icon}
            <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
