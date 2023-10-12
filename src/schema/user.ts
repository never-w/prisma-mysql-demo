import { builder } from "../builder"
import { prisma } from "../db"

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    name: t.exposeString("name", { nullable: true }),
    email: t.exposeString("email"),
    posts: t.relation("posts"),
  }),
})

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    title: t.exposeString("title"),
    published: t.exposeBoolean("published"),
    content: t.exposeString("content", { nullable: true }),
    viewCount: t.exposeInt("viewCount"),
    author: t.relation("author"),
  }),
})

const PostCreateInput = builder.inputType("PostCreateInput", {
  fields: (t) => ({
    title: t.string({ required: true }),
    content: t.string(),
  }),
})

const UserCreateInput = builder.inputType("UserCreateInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    name: t.string(),
    posts: t.field({ type: [PostCreateInput] }),
  }),
})

builder.queryFields((t) => ({
  allUsers: t.prismaField({
    description: "客户: 查询客户",
    type: ["User"],
    resolve: (query) => prisma.user.findMany({ ...query }),
  }),
}))

builder.mutationFields((t) => ({
  signupUser: t.prismaField({
    type: "User",
    args: {
      data: t.arg({
        type: UserCreateInput,
        required: true,
      }),
    },
    resolve: (query, parent, args) => {
      return prisma.user.create({
        ...query,
        data: {
          email: args.data.email,
          name: args.data.name,
          posts: {
            create: (args.data.posts ?? []).map((post) => ({
              title: post.title,
              content: post.content ?? undefined,
            })),
          },
        },
      })
    },
  }),
}))
