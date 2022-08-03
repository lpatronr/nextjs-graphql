import type { TodoType } from "../types/todoType";
import { gql, useMutation } from "urql";

export default function DoneButton({ done, id }: TodoType) {
  const [{ fetching, error }, toggleDoneMutation] = useMutation(gql`
    mutation ($id: ID!, $done: Boolean!) {
      updateTodo(id: $id, done: $done) {
        id
        done
      }
    }
  `);

  function handleDone() {
    toggleDoneMutation({ id, done: !done });
  }

  return (
    <button
      onClick={handleDone}
      className="flex-no-shrink text-green border-green hover:bg-green ml-4 mr-2 rounded border-2 p-2 hover:text-white"
    >
      {fetching ? "Processing..." : error ? "Whop..." : done ? "Undone" : "Done"}
    </button>
  );
}
