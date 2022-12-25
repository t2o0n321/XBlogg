import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/Users.js'

export const register = async (req, res) => {
    try {
        const {
            Username,
            Password,
            Email,
            Phone,
            DisplayName
        } = req.body

        const salt = bcrypt.genSaltSync()
        const passHash = await bcrypt.hash(Password, salt)

        const newUser = new User({
            Username: Username,
            PsswdHash: passHash,
            Email: Email,
            Phone: Phone,
            DisplayName: DisplayName,
            DisplayPicPath: '',
            Posts: []
        })
        try {
            await newUser.save()
        } catch (err) {
            return res.status(422).json({ Error: 'Seems like you already have registered ... ' })
        }

        return res.status(201).json({ status: 'Okay' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ Error: 'Internal Server Error' })
    }
}