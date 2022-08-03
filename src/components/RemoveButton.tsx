import type { TodoType } from "../types/todoType";
import { gql, useMutation } from "urql";

export default function RemoveButton({ id }: Pick<TodoType, "id">) {
  const [{ fetching, error }, removeMutation] = useMutation(gql`
    mutation deleteTodo($id: ID!) {
      deleteTodo(id: $id) {
        id
      }
    }
  `);

  function handleDeletion() {
    removeMutation({ id });
  }

  return (
    <button
      onClick={handleDeletion}
      className="flex-no-shrink text-green border-green hover:bg-green ml-4 mr-2 rounded border-2 p-2 hover:text-white"
    >
      {fetching ? "Deleting..." : error ? "Error" : "Delete"}
    </button>
  );
}
