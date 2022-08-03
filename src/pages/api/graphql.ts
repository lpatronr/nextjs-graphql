import NextCors from "nextjs-cors";
import { ApolloServer, gql } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse, NextConfig } from "next";
import todos from "../../lib/todos.json";
import { TodoType } from "../../types/todoType";

const allTodos: TodoType[] = [...todos];

const server = new ApolloServer({
  typeDefs: gql`
    type Query {
      todos(query: String): [Todo]!
    }
    type Mutation {
      createTodo(description: String!): Todo
      updateTodo(id: ID!, description: String, done: Boolean): Todo
      deleteTodo(id: ID!): Todo
    }
    type Todo {
      id: ID
      description: String
      done: Boolean
    }
  `,
  resolvers: {
    Query: {
      todos(_, { query }: { query?: string }): TodoType[] {
        if (!query) return allTodos;
        return allTodos.filter((todo) => todo.description.includes(query));
      },
    },
    Mutation: {
      createTodo(_, { description }: Pick<TodoType, "description">) {
        const newTodo = {
          id: allTodos.length + 1,
          description,
          done: false,
        };
        allTodos.push(newTodo);
        return newTodo;
      },
      updateTodo(
        _,
        { id, description, done }: TodoType & { description?: string; done?: boolean },
      ) {
        const index = allTodos.findIndex((todo) => todo.id === Number(id));
        if (index === -1) return null;

        const updatedTodo = {
          ...allTodos[index],
          description: description ?? allTodos[index]!.description,
          done: done ?? allTodos[index]!.done,
        };
        allTodos[index] = updatedTodo as TodoType;
        return updatedTodo;
      },
      deleteTodo(_, { id }: Pick<TodoType, "id">) {
        const index = allTodos.findIndex((todo) => todo.id === Number(id));
        if (index === -1) return null;

        const deletedTodo = allTodos[index];
        allTodos.splice(index, 1);
        return deletedTodo!.id;
      },
    },
  },
});

export const config: NextConfig = {
  api: {
    bodyParser: false,
  },
};

const serverInstance = server.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, { origin: "*" });
  await serverInstance;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
