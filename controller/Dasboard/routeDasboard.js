import { Article } from '../../models/UserModel.js';

// CREATE: Tambah artikel baru
export const createArticle = async (req, res) => {
    try {
        const { title, publisher, image_url, snippet, full_article_link } = req.body;
        const newArticle = await Article.create({
            title,
            publisher,
            image_url,
            snippet,
            full_article_link
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: 'Error creating article' });
    }
};

// READ: Ambil semua artikel
export const getArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({ order: [['created_at', 'DESC']] });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching articles' });
    }
};

// READ: Ambil artikel berdasarkan ID
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching article' });
    }
};

// // UPDATE: Ubah artikel berdasarkan ID
// router.put('/articles/:id', async (req, res) => {
//     try {
//         const { title, publisher, image_url, snippet, full_article_link } = req.body;
//         const article = await Article.findByPk(req.params.id);
//         if (!article) {
//             return res.status(404).json({ error: 'Article not found' });
//         }
//         await article.update({ title, publisher, image_url, snippet, full_article_link });
//         res.json(article);
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating article' });
//     }
// });

// // DELETE: Hapus artikel berdasarkan ID
// router.delete('/articles/:id', async (req, res) => {
//     try {
//         const article = await Article.findByPk(req.params.id);
//         if (!article) {
//             return res.status(404).json({ error: 'Article not found' });
//         }
//         await article.destroy();
//         res.json({ message: 'Article deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting article' });
//     }
// });
