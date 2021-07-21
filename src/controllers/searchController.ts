import { Group } from "@entities/Group";
import { Post } from "@entities/Post";
import { User } from "@entities/User";
import { LoadStrategy, RequestContext } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/knex";
import { Request, Response } from "express";

export const search = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager() as EntityManager;
  const query = `%${req.query.query as string}%`

  const data = await Promise.all([
    em.find(User, {
      $or: [
        { 
          username: {
            $like: query
          },
        },
        {
          profile: {
            fullName: {
              $like: query
            }
          }
        }
      ]
    }, {
      populate: ['profile'],
      strategy: LoadStrategy.JOINED
    }),
    em.find(Group, {
      name: {
        $like: query
      }
    }),
    em.find(Post, {
      $or: [
        {
          title: {
            $like: query
          },
        },
        {
          media: {
            mediaText: {
              $like: query
            }
          }
        }
      ],
    }, {
      populate: ['author', 'author.profile','group'],
      strategy: LoadStrategy.JOINED
    })
  ]);

  res.status(200).send({ data });
}