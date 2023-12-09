import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import WebSocket from "ws";

const camEmittter = new WebSocket("ws://raspberrypi.local:8000/cam");

camEmittter.on("error", console.error);

camEmittter.on("open", function open() {
  console.log("connected to pi camera");
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
      camEmittter.on("message", (data) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        console.log("received: %s", data.toString());
        const msg = JSON.parse(data.toString()) as CamPayload;
        emit.next(msg.pixels);
      });

      return () => {
        console.log("closing connection to camera");
      };
    });
  }),
});

type CamPayload = {
  pixels: number[];
  temp: number;
};
