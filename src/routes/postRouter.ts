import { createPostController } from "@controllers/postController";
import { verifyAuthor, verifyImageUpload } from "@middlewares/verifyPostPermission";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";
import { postCreatePermission } from "@middlewares/verifyGroupPermission";
import { postUpload } from "@controllers/multerController";
import { RequestContext, EntityManager } from "@mikro-orm/core";
import { Post } from "@entities/Post";

const router = Router();

router.route("/create")
  .post(verifyAuth, postCreatePermission, createPostController);

router.route("/:postId/image")
  .post(verifyAuth,
    verifyAuthor,
    verifyImageUpload,
    postUpload.single("post"),
    async (req, res) => {
      const em = RequestContext.getEntityManager() as EntityManager;
      const postId = parseInt(req.params.postId);
      const post = await em.findOneOrFail(Post, {
        id: postId
      }, {
        populate: ['media']
      });
      // @ts-ignore
      const postPicture = req.file;
      if (postPicture) {
        // @ts-ignore
        post.media.mediaUrl = postPicture.path as string;
      }
      await em.persistAndFlush(post);
      res.status(201).send({
        data: {
          post
        }
      });
    }
  );

export default router;