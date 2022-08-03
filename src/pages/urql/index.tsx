import type { NextPage } from "next";
import type { FormEvent } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import Body from "../../components/Body";
import Todo from "../../components/Todo";
import { useState } from "react";
import { Provider, createClient, dedupExchange, fetchExchange, gql } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import Form from "../../components/Form";
import { TodoType } from "../../types/todoType";

const client = createClient({
  url: "http://localhost:3000/api/graphql",
  exchanges: [
    dedupExchange, // dedupe first so we don't do unnecessary work
    /*
     * store the result of the queries in the cache
     * __typename can be used to detect commonalities and data dependencies between queries and mutations
     * i.e. reexecutes and invalidates all queries containing the __typename
     * https://urql.dev/exchange-types/cache-exchange.html
     * all queries and mutations should get the id to be normalized
     * */
    cacheExchange({
      // https://formidable.com/open-source/urql/docs/graphcache/cache-updates/#optimistic-updates
      optimistic: {
        updateTodo: (vars, cache, info) => {
          console.log(vars, cache, info);
          return {
            __typename: "Todo",
            // returning the vars.id and vars.done to simulate/match what the server would return
            // remember: the vars returned must match what is being sent to the server
            id: vars.id,
            done: !vars.done,
          };
        },
      },
      updates: {
        Mutation: {
          createTodo: (result, args, cache, info) => {
            // result -> { createTodo: { description: "", id: "", done: false, __typename: "Todo" } }
            // args -> { description: "" }
            // info -> { fieldName: "createTodo", parentKey: "Mutation", parentTypeName: "Mutation", optimistic: false, ... }
            console.table({ result, args, cache, info });
            cache.updateQuery(
              {
                // updates the data for this particular query (so the idea is to keep the queries in a constant file to reuse)
                query: gql`
                  {
                    todos(query: "") {
                      id
                      description
                      done
                    }
                  }
                `,
              },
              (cache) => {
                console.log(cache); // { todos: [TodoType] }
                cache.todos.unshift(result.createTodo);
                return cache;
              },
            );
          },
          deleteTodo: (result, args, cache, info) => {
            console.table({ result, args, cache, info });
            cache.updateQuery(
              {
                query: gql`
                  {
                    todos(query: "") {
                      id
                      description
                      done
                    }
                  }
                `,
              },
              (cache) => {
                console.log(cache); // { todos: [TodoType] }
                cache.todos = cache.todos.filter((todo: TodoType) => todo.id !== args.id);
                return cache;
              },
            );
          },
        },
      },
    }),
    fetchExchange, // async, so it needs to go last. Add results of the fetch to the output stream
  ],
});

const Urql: NextPage = () => {
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQuery(value);
  }

  return (
    <Provider value={client}>
      <Head>
        <title>Next.js GraphQL - urql</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Body>
        <Header
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={handleSubmit}
          title={"urql"}
        />
        <Todo query={query} />
        <Form />
      </Body>
    </Provider>
  );
};

export default Urql;
