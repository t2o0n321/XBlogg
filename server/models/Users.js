import mongoose from "mongoose"
import mongooseUniqueValidator from "mongoose-unique-validator"

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 30
    },
    PsswdHash: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    Phone: {
        type: String,
        required: true,
        max: 20
    },
    DisplayName: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 20
    },
    DisplayPicPath: {
        type: String,
        default: ''
    },
    Posts: {
        type: Array,
        default: []
    }
}, { timeseries: true })

UserSchema.plugin(mongooseUniqueValidator)

const User = mongoose.model('User', UserSchema)
export default User