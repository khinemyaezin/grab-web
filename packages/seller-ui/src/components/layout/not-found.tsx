import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";

const funnyMessages = [
  "Looks like this page went on vacation 🏖️",
  "This page is playing hide and seek… and winning 🙈",
  "Even our best detectives can't find this page 🕵️",
  "This page ghosted us 👻",
  "Plot twist: the page was never here 🎬",
  "404 reasons this page doesn't exist 📋",
  "The page you seek is in another castle 🏰",
];

export function NotFoundPage() {
  const [msgIndex, setMsgIndex] = useState(
    () => Math.floor(Math.random() * funnyMessages.length),
  );

  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((i) => (i + 1) % funnyMessages.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 bg-background p-6 md:p-10 select-none">

      <h1 className="animate-pulse text-8xl font-extrabold tracking-tighter text-primary drop-shadow-sm">
        404
      </h1>

      <h2 className="text-xl font-semibold mt-1">Page Not Found</h2>

      <p
        key={msgIndex}
        className="text-muted-foreground text-sm max-w-xs text-center mt-1 min-h-[2.5rem] flex items-center justify-center transition-opacity duration-500 ease-in-out"
      >
        {funnyMessages[msgIndex]}
      </p>

      <div className="pt-4 hover:scale-105 transition-transform duration-200">
        <Button asChild>
          <Link to="/">Take me home</Link>
        </Button>
      </div>
    </div>
  );
}
