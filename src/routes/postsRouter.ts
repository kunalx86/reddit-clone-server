import { createPost, getPost, getPosts, votePost } from "@controllers/postsController";
import { verifyAuthor, verifyImageUpload } from "@middlewares/verifyPostPermission";
import { verifyAuth } from "@middlewares/verifyAuth";
import { Router } from "express";
import { postCreatePermission } from "@middlewares/verifyGroupPermission";
import { postUpload } from "@controllers/multerController";
import { Post } from "@entities/Post";

const router = Router();

router.route("/")
  .post(verifyAuth, postCreatePermission, createPost)
  .get(getPosts);

router.route("/:postId/image")
  .post(verifyAuth,
    verifyAuthor,
    verifyImageUpload,
    postUpload.single("post"),
    async (req, res) => {
      const { em } = req;
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

router.route("/:postId/vote")
  .post(verifyAuth, votePost);

router.route("/:postId")
  .get(verifyAuth, getPost);

export default router;