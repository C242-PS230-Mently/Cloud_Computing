import { Article } from '../../models/UserModel.js';

// CREATE data
export const createArticle = async (req, res) => {
    try {
        const { title, publisher, image_url, snippet, full_article_link, category } = req.body;

        const newData = await Article.create({
            title, 
            publisher, 
            image_url, 
            snippet, 
            category, // workshop dan article
            full_article_link
        });

        res.status(201).json(newData);
    } catch (error) {
        console.error('Error creating data:', error);
        res.status(500).json({ error: 'Error creating data', message: error.message });
    }
};

// UPDATE data berdasarkan ID
export const updateArticle = async (req, res) => {
    try {
        const { title, publisher, image_url, snippet, full_article_link, category } = req.body;
        const data = await Article.findByPk(req.params.id);

        if (!data) {
            return res.status(404).json({ error: 'Data tidak ditemukan' });
        }

        await data.update({ title, publisher, image_url, snippet, full_article_link, category });
        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
};

// READ: Ambil semua data, berdasarkan kategori, atau berdasarkan ID
export const getAllDataByCategory = async (req, res) => {
    try {
        const { category, id } = req.params;

        if (id) {
            const data = await Article.findByPk(id);
            if (!data) {
                return res.status(404).json({ error: 'Data tidak ditemukan' });
            }

            if (data.category !== category) {
                return res.status(400).json({
                    error: `Data dengan ID ${id} tidak ada di dalam category ${category}`,
                });
            }

            return res.status(200).json({
                message: 'Sukses mengambil data berdasarkan ID!',
                data,
            });
        }

        if (!category) {
            const allData = await Article.findAll({ order: [['created_at', 'DESC']] });

            const workshops = allData.filter(item => item.category === 'workshop');
            const articles = allData.filter(item => item.category === 'article');

            return res.status(200).json({
                message: 'Sukses mengambil semua data!',
                data: { workshops, articles },
            });
        }

        if (!['article', 'workshop'].includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        const filteredData = await Article.findAll({
            where: { category },
            order: [['created_at', 'DESC']],
        });

        return res.status(200).json({
            message: `mengambil data di dalam kategori ${category} successful!`,
            data: filteredData,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
};