import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import WebSocket from "ws";

const camEmittter = new WebSocket("ws://localhost:8000/cam");

camEmittter.on("error", console.error);

camEmittter.on("open", function open() {
  console.log("connected");
});

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),

  randomNumber: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      console.log("subscribed");
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 100000);
      return () => {
        clearInterval(int);
      };
    });
  }),

  camData: publicProcedure.subscription(() => {
    return observable<number[]>((emit) => {
      // const onUpdate = (data: string) => {
      //   const vals = data.split(",");
      //   const pixels = vals.map((val) => Number(val));
      //   emit.next(pixels);
      // };
      camEmittter.on("message", function message(data) {
        console.log(`data: ${data}`);
        const msg: any = JSON.parse(data.toString());
        emit.next(msg.pixels as number[]);
      });

      return () => {
        console.log("closing connection to camera");
        camEmittter.close();
      };
    });
  }),
});
