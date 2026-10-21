"use client";


type HeaderProps = {
  title: string;
  description: string;
  children?: React.ReactElement
}

export function Header({ title, description, children }: HeaderProps) {

  return (
    <div className="pb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description} </p>
      </div>
      { children }
    </div>
  );
}
