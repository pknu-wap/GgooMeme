INSERT INTO users(id, email, email_verified, image_url, name, password, provider, provider_id)
VALUES(1, 'lcl8661@gmail.com', 0, 'https://lh3.googleusercontent.com/a/ACg8ocK8s0zbZgNWzw8F9MbvqZlKMGAfUjXlsnluEezFSiJ9Zn-MiBwK=s96-c', '이채린', NULL, 'google', '109253574579197183232');

INSERT INTO posts(id, image)
VALUES (1, "url"),
       (2, "url"),
       (3, "url"),
       (4, "url"),
       (5, "url"),
       (6, "url"),
       (7, "url"),
       (8, "url"),
       (9, "url"),
       (10, "url");

INSERT INTO post_bookmarked_user(post_id, user_id)
VALUES(1, 1),
      (2, 1),
      (3, 1);

INSERT INTO hashtags(id, name)
VALUES (1, "html"),
       (2, "css"),
       (3, "react"),
       (4, "ppt"),
       (5, "flowchart"),
       (6, "banner");

INSERT INTO post_hashtag(post_id, hashtag_id)
VALUES (1, 1),
       (2, 1), (2, 2),
       (3, 1), (3, 2), (3, 3),
       (4, 1), (4, 2), (4, 3),(4, 4),
       (5, 1), (5, 2), (5, 3),(5, 4),(5, 5),
       (6, 1), (6, 2), (6, 3),(6, 4),(6, 5), (6, 6),
       (7, 1), (7, 2), (7, 3),(7, 4),(7, 5), (7, 6),
       (8, 1), (8, 2), (8, 3),(8, 4),(8, 5), (8, 6),
       (9, 1), (9, 2), (9, 3),(9, 4),(9, 5), (9, 6),
       (10, 1), (10, 2), (10, 3),(10, 4),(10, 5), (10, 6);



