import { gql, useMutation } from "urql";
import { FormEvent, useState } from "react";

export default function Form(): JSX.Element {
  const [description, setDescription] = useState("");
  const [{ fetching, error, data }, createTodo] = useMutation(
    gql`
      mutation ($description: String!) {
        createTodo(description: $description) {
          id
          description
          done
        }
      }
    `,
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!description) return;

    createTodo({ description }).then(({ error }) => {
      if (!error) {
        setDescription("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        className="flex flex-col items-center justify-center gap-2 p-4"
        disabled={fetching || Boolean(error)}
      >
        <legend className="text-center">Add Todo</legend>
        <label className="flex flex-col gap-1 text-center" htmlFor="description">
          Description
          <input
            className="bg-neutral-700 px-4"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit" className="rounded bg-indigo-600 px-2 py-1">
          {fetching ? "Processing..." : "Add"}
        </button>
      </fieldset>
    </form>
  );
}
