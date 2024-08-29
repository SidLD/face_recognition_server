import client from '../util/database';

export const register = async (req: any, res: any) => {
    try {
        const { firstName, lastName, middleName, profileImage } = req.body;
  
        if (!firstName || !lastName || !profileImage) {
          return res.status(400).json({ error: 'irst name, and last name are required' });
        }
      
        try {
          // Insert user into the database
          const result = await client.query(
            'INSERT INTO users (firstName, lastName, middleName, profileImage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [ firstName, lastName, middleName, profileImage]
          );
      
          res.status(201).json(result.rows[0]);
        } catch (error) {
          console.error('Database query error', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}
export const login = async (req: any, res: any) => {
    try {
        let params:any = req.body

    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data or Email Already Taken"})
    }
}