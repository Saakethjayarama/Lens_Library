// Mock user data
const mockUser = {
  username: "user",
  password: "password",
};

export const login = (
  username?: string,
  password?: string
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === mockUser.username && password === mockUser.password) {
        resolve({ success: true, message: "Login successful" });
      } else {
        resolve({ success: false, message: "Invalid username or password" });
      }
    }, 500);
  });
};
