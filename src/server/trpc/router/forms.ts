import { t } from "../trpc";
import { z } from "zod";
import { contextProps } from "@trpc/react/dist/internals/context";

export const formsRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.form.findMany({include: {fields: true}});
  }),
  get: t.procedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.form.findFirst({ where: {id: input}, include: {fields: true}});
  }),
  createForm: t.procedure
    .input(
      z.object({
        fields: z.array(
          z.object({
            id: z.string(),
            label: z.string()
          })
        ),
        name: z.string().nullish()
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.form.create({
        data: {
          fields: {
            create: input.fields
          },
          name: input.name
        },
        include: {
          fields: true
        }
      });
    }),
  updateForm: t.procedure
    .input(
      z.object({
        id: z.string(),
        newFields: z.array(
          z.object({
            id: z.string(),
            label: z.string()
          })
        )
      })
    )
    .mutation(async ({ input, ctx }) => {
      // const newFields = input.fields.filter(field => !field.id);
      // const updatedFields = input.fields.filter(field => Boolean(field.id));

      // await Promise.all(
      //   updatedFields.map(updatedField => {
      //     return ctx.prisma.field.update({
      //       where: {id: updatedField.id},
      //       data: updatedField
      //     });
      //   })
      // );

      const form = await ctx.prisma.form.update({
        where: {id: input.id},
        data: {
          fields: {create: input.newFields}
        },
        include: {
          fields: true
        }
      });

      return form;
    }),

    delete: t.procedure.input(z.string()).mutation(({ ctx, input }) => {
      return ctx.prisma.form.delete({ where: {id: input}, include: {fields: true}});
    }),

  // deleteForm: t.procedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .mutation(async ({ctx, input}) => {
  //       return ctx.prisma.form.delete({where: {id: input}})
  //   })

});
