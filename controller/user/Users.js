
export const getDashboardById = (req, res) => {
   
    const { user } = req;

    return res.status(200).json({
        msg: 'Dashboard data',
        userId: user.id,
        fullName: user.full_name,
        email: user.email,
    });
};