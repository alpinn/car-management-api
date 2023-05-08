const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { use } = require("../../config/routes");

const encryptPassword = async (password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    return encryptedPassword;
  } catch (err) {
    return err;
  }
}

const comparePassword = async (password, encryptedPassword) => {
  try {
    const result = await bcrypt.compare(password, encryptedPassword);
    return result;
  } catch (err) {
    return err;
  }
}

const createToken = (payload) => {
  return jwt.sign(payload, "secret");
}

module.exports = {
  async createAdmin(requestBody) {
    const { name, email, password } = requestBody;

    const encryptedPassword = await encryptPassword(password);
    return userRepository.create({ name, email, encryptedPassword, userRole: 'admin' });
  },

  async create(requestBody) {
    const { name, email, password } = requestBody;

    const encryptedPassword = await encryptPassword(password);
    return userRepository.create({ name, email, encryptedPassword, userRole: 'member' });
  },

  async login(requestBody) {
    const { email, password } = requestBody;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      return {
        isValid: false,
        message: 'Email not found',
        data: null
      }
    }

    const isPasswordCorrect = await comparePassword(password, user.encryptedPassword);

    if (!isPasswordCorrect) {
      return {
        isValid: false,
        message: 'Password not correct',
        data: null
      }
    }

    const token = createToken({
      id: user.id,
      userRole: user.userRole
    })

    user.token = token;

    if (isPasswordCorrect) {
      return {
        isValid: true,
        message: '',
        data: user
      }
    }
  },

  update(id, requestBody) {
    return userRepository.update(id, requestBody);
  },

  delete(id) {
    return userRepository.delete(id);
  },

  async list() {
    try {
      const users = await userRepository.findAll();
      const userCount = await userRepository.getTotalUser();

      return {
        data: users,
        count: userCount,
      };
    } catch (err) {
      throw err;
    }
  },

  get(id) {
    return postRepository.find(id);
  },
};
