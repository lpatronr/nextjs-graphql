import { TodoType } from "../types/todoType";
import { gql, useQuery } from "urql";
import RemoveButton from "./RemoveButton";
import DoneButton from "./DoneButton";

type Props = {
  query: string;
};

export default function Todo({ query }: Props) {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: gql`
      query Todo($query: String) {
        todos(query: $query) {
          id
          description
          done
        }
      }
    `,
    variables: { query },
  });

  if (fetching) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center">Error: {error.message}</p>;

  return (
    <ul className="flex w-[40rem] flex-col gap-2 p-4">
      {data.todos.map(({ id, description, done }: TodoType) => (
        <li key={id} className="flex w-full items-center rounded bg-neutral-900 p-6 shadow">
          <span>{done ? "✔️" : "❌"}</span>
          <h1 className="font-regular w-full">{description}</h1>
          <DoneButton done={done} description={description} id={id} />
          <RemoveButton id={id} />
        </li>
      ))}
    </ul>
  );
}
