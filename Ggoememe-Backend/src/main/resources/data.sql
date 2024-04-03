INSERT INTO posts(id, image)
VALUES (1, "url"),
       (2, "url"),
       (3, "url");

INSERT INTO hashtags(id, name)
VALUES (1, "html"),
       (2, "css"),
       (3, "react");

INSERT INTO post_hashtag(post_id, hashtag_id)
VALUES (1, 1),
       (2, 1),
       (2, 2),
       (3, 1),
       (3, 2),
       (3, 3);



