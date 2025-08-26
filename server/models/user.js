const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto-js')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{ type: mongoose.Types.ObjectId, ref: 'Address' }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: String
    }
}, {
    timestamps: true
});

// Middleware "pre-save" của Mongoose: sẽ chạy TRƯỚC KHI lưu document vào MongoDB
userSchema.pre('save', async function (next) {
    // Kiểm tra xem field 'password' có bị thay đổi hay không
    // Nếu mật khẩu KHÔNG thay đổi (ví dụ: update các field khác), bỏ qua việc băm mật khẩu
    if (!this.isModified('password')) {
        return next(); // Gọi next() để tiếp tục tiến trình lưu mà KHÔNG hash lại password
    }

    // Tạo một "salt" - chuỗi ngẫu nhiên dùng để tăng độ bảo mật cho việc băm mật khẩu
    // Số 10 ở đây là số vòng (rounds) xử lý, giá trị càng cao thì hash càng an toàn nhưng chậm hơn
    const salt = bcrypt.genSaltSync(10);

    // Băm (hash) mật khẩu người dùng với salt vừa tạo
    // bcrypt.hash() là hàm async, nên cần await
    this.password = await bcrypt.hash(this.password, salt);

    // Gọi next() để báo với Mongoose rằng middleware đã xử lý xong
    next();
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}

//Export the model
module.exports = mongoose.model('User', userSchema);