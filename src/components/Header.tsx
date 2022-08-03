import { ChangeEvent, FormEvent } from "react";

type Props = {
  title: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function Header({ title, value, onChange, onSubmit }: Props) {
  return (
    <div className="flex justify-between rounded p-4">
      <h1 className="text-left text-2xl font-medium text-white">{title} Todo</h1>
      <form onSubmit={onSubmit} className="flex gap-4">
        <button className="rounded bg-indigo-700 px-2">Search</button>
        <input value={value} onChange={onChange} className="bg-neutral-700 px-4" />
      </form>
    </div>
  );
}
