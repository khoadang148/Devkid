import {
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../actions/auth/authActions";

// Hàm kiểm tra và parse dữ liệu từ localStorage
const parseData = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null; // Nếu có dữ liệu thì parse, nếu không thì trả về null
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return null; // Trả về null nếu gặp lỗi khi parse
  }
};

const initialState = {
  // Sử dụng hàm parseData để lấy dữ liệu từ localStorage và đảm bảo không có lỗi
  user: parseData("user"),
  tokens: parseData("tokens") || {
    accessToken: null,
    refreshToken: null,
  },
  loading: false,
  error: null,
  users: [],
};

const authReducer = (state = initialState, action) => {
  console.log("Action:", action);
  console.log("Previous State:", state);
  switch (action.type) {
    case "REGISTER_REQUEST":
    case "LOGIN_REQUEST":
    case "FETCH_USERS_REQUEST":
      return { ...state, loading: true, error: null };

    case "REGISTER_SUCCESS":
    case "LOGIN_SUCCESS": {
      const { user, tokens } = action.payload;

      // Lưu vào localStorage khi đăng nhập thành công
      try {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokens", JSON.stringify(tokens));
      } catch (e) {
        console.error("Error saving data to localStorage", e);
      }

      const newState = {
        ...state,
        loading: false,
        user,
        tokens,
        error: null,
      };

      console.log("Updated State:", newState);
      return newState;
    }

    case "FETCH_USERS_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: null };

    case "REGISTER_FAILURE":
    case "LOGIN_FAILURE":
    case "FETCH_USERS_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      // Xóa tất cả thông tin người dùng khi logout
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
      } catch (e) {
        console.error("Error removing data from localStorage", e);
      }

      return {
        ...initialState, // Reset state về ban đầu
        users: state.users, // Giữ lại danh sách users nếu cần
      };

    case UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload?.result?.data || state.user, // Kiểm tra dữ liệu API
      };

    case UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
